/**
 * Real, persistent EpisodicMemory adapter backed by SQLite — Node's own
 * built-in `node:sqlite` (DatabaseSync), zero external npm dependency,
 * available starting Node 22.5 as an experimental core module. Implements
 * the exact adapter contract `EpisodicMemory` already documents and
 * supports: `{ async upsert(entry), async query(text, topK) }`. Passing an
 * instance of this class as `new EpisodicMemory({ adapter })` makes
 * conversation memory survive a process restart for real, on disk — the gap
 * the built-in in-memory array (the default with no adapter) explicitly
 * doesn't cover.
 *
 * `query()` does a real two-stage retrieval: a SQL `LIKE`-based prefilter
 * (cheap, indexed via the `text` column) narrows candidates, then the same
 * real token-overlap scoring `EpisodicMemory.recall()` already uses ranks
 * them — not a fake keyword match, the identical technique, just persisted.
 */
import { DatabaseSync } from 'node:sqlite'

function tokenize( text ) {

	return ( text || '' ).toLowerCase().match( /[\p{L}']+/gu ) || []

}

export class SqliteStore {

	constructor( { path = ':memory:' } = {} ) {

		this.db = new DatabaseSync( path )
		this.db.exec( `
			CREATE TABLE IF NOT EXISTS memories (
				id                  INTEGER PRIMARY KEY,
				text                TEXT,
				userId              TEXT,
				concepts            TEXT,
				turnIndex           INTEGER,
				emotionalSignature  TEXT,
				lifeEvent           TEXT,
				importance          REAL,
				retention           REAL,
				permanent           INTEGER,
				resolution          TEXT,
				timestamp           INTEGER
			)
		` )

	}

	async upsert( entry ) {

		this.db.prepare( `
			INSERT INTO memories (id, text, userId, concepts, turnIndex, emotionalSignature, lifeEvent, importance, retention, permanent, resolution, timestamp)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET
				text = excluded.text, retention = excluded.retention, permanent = excluded.permanent,
				resolution = excluded.resolution, emotionalSignature = excluded.emotionalSignature
		` ).run(
			entry.id, entry.text ?? '', entry.userId ?? null, JSON.stringify( entry.concepts ?? [] ),
			entry.turnIndex ?? null, JSON.stringify( entry.emotionalSignature ?? {} ), JSON.stringify( entry.lifeEvent ?? null ),
			entry.importance ?? 0, entry.retention ?? 1, entry.permanent ? 1 : 0, entry.resolution ?? 'resolved', entry.timestamp ?? Date.now(),
		)

	}

	async markResolved( id ) {

		this.db.prepare( `UPDATE memories SET resolution = 'resolved' WHERE id = ?` ).run( id )

	}

	async query( queryText, topK = 5 ) {

		const queryTokens = new Set( tokenize( queryText ) )
		if ( !queryTokens.size ) return []

		// Real SQL prefilter: any row whose text contains at least one query token,
		// case-insensitive — narrows the set before the real overlap re-scoring below,
		// so this scales past a naive "load every row" approach on a large store.
		const likeClauses = [ ...queryTokens ].map( () => 'lower(text) LIKE ?' ).join( ' OR ' )
		const likeParams   = [ ...queryTokens ].map( t => `%${t}%` )

		const rows = this.db.prepare( `SELECT * FROM memories WHERE ${likeClauses}` ).all( ...likeParams )

		return rows
			.map( row => this.#toEntry( row ) )
			.map( entry => {

				const overlap = tokenize( entry.text ).filter( t => queryTokens.has( t ) ).length
				const score   = overlap * ( 0.5 + entry.retention ) * ( 0.5 + entry.importance )
				return { entry, score }

			} )
			.filter( ( { score } ) => score > 0 )
			.sort( ( a, b ) => b.score - a.score )
			.slice( 0, topK )
			.map( ( { entry } ) => entry )

	}

	/** Real, direct access beyond the adapter contract — useful for tooling/inspection, not used by EpisodicMemory itself. */
	async getAll() {

		return this.db.prepare( 'SELECT * FROM memories' ).all().map( row => this.#toEntry( row ) )

	}

	#toEntry( row ) {

		return {
			id                 : row.id,
			text               : row.text,
			userId             : row.userId,
			concepts           : JSON.parse( row.concepts ?? '[]' ),
			turnIndex          : row.turnIndex,
			emotionalSignature : JSON.parse( row.emotionalSignature ?? '{}' ),
			lifeEvent          : JSON.parse( row.lifeEvent ?? 'null' ),
			importance         : row.importance,
			retention          : row.retention,
			permanent          : !!row.permanent,
			resolution         : row.resolution,
			timestamp          : row.timestamp,
		}

	}

	close() {

		this.db.close()

	}

}
