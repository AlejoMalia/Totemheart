export const LIFE_EVENTS = [

	{ id: 'death_spouse', label: 'Death of spouse', sourced: true, impact: 100, valence: -1.0, dominance: -0.9, area: [ 'Engram', 'Affect' ], keywords: [ 'murio mi esposo', 'murio mi esposa', 'murio mi conyuge', 'viudo', 'viuda', 'fallecio mi pareja' ] },
	{ id: 'divorce', label: 'Divorce', sourced: true, impact: 73, valence: -0.8, dominance: -0.5, area: [ 'Ego', 'Echo' ], keywords: [ 'divorcio', 'me divorcio', 'nos divorciamos', 'divorciandome' ] },
	{ id: 'marital_separation', label: 'Marital separation', sourced: true, impact: 65, valence: -0.7, dominance: -0.4, area: [ 'Ego', 'Echo' ], keywords: [ 'nos separamos', 'me separe de mi pareja', 'separacion matrimonial' ] },
	{ id: 'jail_term', label: 'Jail term', sourced: true, impact: 63, valence: -0.9, dominance: -0.9, area: [ 'Ego', 'Restraint' ], keywords: [ 'carcel', 'prision', 'condena', 'me encerraron' ] },
	{ id: 'death_close_family', label: 'Death of close family member', sourced: true, impact: 63, valence: -0.9, dominance: -0.7, area: [ 'Engram', 'Affect' ], keywords: [ 'murio mi padre', 'murio mi madre', 'murio mi hermano', 'fallecio mi familiar', 'perdi a mi' ] },
	{ id: 'personal_injury_illness', label: 'Personal injury or illness', sourced: true, impact: 53, valence: -0.7, dominance: -0.6, area: [ 'Drive', 'Affect' ], keywords: [ 'me diagnosticaron', 'enfermedad grave', 'estoy muy enfermo', 'lesion grave' ] },
	{ id: 'marriage', label: 'Marriage', sourced: true, impact: 50, valence: 0.8, dominance: 0.2, area: [ 'Appraisal', 'Affect' ], keywords: [ 'me caso', 'nos casamos', 'mi boda' ] },
	{ id: 'fired_at_work', label: 'Fired at work', sourced: true, impact: 47, valence: -0.7, dominance: -0.6, area: [ 'Ego', 'Drive' ], keywords: [ 'me despidieron', 'perdi mi trabajo', 'me echaron del trabajo' ] },
	{ id: 'marital_reconciliation', label: 'Marital reconciliation', sourced: true, impact: 45, valence: 0.5, dominance: 0.2, area: [ 'Ego', 'Affect' ], keywords: [ 'nos reconciliamos', 'volvimos con mi pareja' ] },
	{ id: 'retirement', label: 'Retirement', sourced: true, impact: 45, valence: 0.1, dominance: -0.2, area: [ 'Drive', 'Ego' ], keywords: [ 'me jubile', 'mi jubilacion' ] },
	{ id: 'family_member_health_change', label: 'Change in health of family member', sourced: true, impact: 44, valence: -0.5, dominance: -0.3, area: [ 'Empathy', 'Affect' ], keywords: [ 'mi familiar esta enfermo', 'la salud de mi madre', 'la salud de mi padre' ] },
	{ id: 'pregnancy', label: 'Pregnancy', sourced: true, impact: 40, valence: 0.6, dominance: -0.2, area: [ 'Empathy', 'Drive' ], keywords: [ 'estoy embarazada', 'vamos a tener un bebe', 'mi pareja esta embarazada' ] },
	{ id: 'sex_difficulties', label: 'Sex difficulties', sourced: true, impact: 39, valence: -0.4, dominance: -0.3, area: [ 'Ego', 'Affect' ], keywords: [ 'problemas sexuales', 'problemas en la intimidad' ] },
	{ id: 'new_family_member', label: 'Gain of new family member', sourced: true, impact: 39, valence: 0.7, dominance: -0.3, area: [ 'Empathy', 'Drive' ], keywords: [ 'nacio mi hijo', 'nacio mi hija', 'tuvimos un bebe', 'adoptamos' ] },
	{ id: 'business_readjustment', label: 'Business readjustment', sourced: true, impact: 39, valence: -0.3, dominance: -0.4, area: [ 'Logic', 'Drive' ], keywords: [ 'reestructuracion en el trabajo', 'cambios en la empresa' ] },
	{ id: 'financial_state_change', label: 'Change in financial state', sourced: true, impact: 38, valence: -0.3, dominance: -0.4, area: [ 'Logic', 'Affect' ], keywords: [ 'cambio mi situacion economica', 'problemas financieros' ] },
	{ id: 'death_close_friend', label: 'Death of close friend', sourced: true, impact: 37, valence: -0.7, dominance: -0.3, area: [ 'Engram', 'Affect' ], keywords: [ 'murio mi amigo', 'fallecio mi amiga' ] },
	{ id: 'change_line_of_work', label: 'Change to different line of work', sourced: true, impact: 36, valence: -0.1, dominance: -0.2, area: [ 'Logic', 'Drive' ], keywords: [ 'cambie de trabajo', 'nueva carrera profesional' ] },
	{ id: 'arguments_with_spouse_change', label: 'Change in number of arguments with spouse', sourced: true, impact: 35, valence: -0.4, dominance: -0.2, area: [ 'Restraint', 'Affect' ], keywords: [ 'discutimos mas', 'peleamos mucho con mi pareja' ] },
	{ id: 'major_purchase_mortgage', label: 'Mortgage or major purchase', sourced: true, impact: 31, valence: -0.2, dominance: -0.3, area: [ 'Logic', 'Ego' ], keywords: [ 'pedi una hipoteca', 'compre una casa' ] },
	{ id: 'foreclosure', label: 'Foreclosure of mortgage or loan', sourced: true, impact: 30, valence: -0.6, dominance: -0.7, area: [ 'Logic', 'Affect' ], keywords: [ 'me embargaron', 'no pude pagar la hipoteca' ] },
	{ id: 'responsibilities_change_work', label: 'Change in responsibilities at work', sourced: true, impact: 29, valence: -0.1, dominance: 0.1, area: [ 'Drive', 'Logic' ], keywords: [ 'nuevas responsabilidades en el trabajo' ] },
	{ id: 'child_leaving_home', label: 'Son or daughter leaving home', sourced: true, impact: 29, valence: -0.3, dominance: -0.2, area: [ 'Empathy', 'Echo' ], keywords: [ 'mi hijo se fue de casa', 'el nido vacio' ] },
	{ id: 'trouble_with_in_laws', label: 'Trouble with in-laws', sourced: true, impact: 29, valence: -0.4, dominance: -0.2, area: [ 'Restraint', 'Affect' ], keywords: [ 'problemas con mis suegros' ] },
	{ id: 'outstanding_achievement', label: 'Outstanding personal achievement', sourced: true, impact: 28, valence: 0.8, dominance: 0.6, area: [ 'Ego', 'Drive' ], keywords: [ 'logre algo importante', 'consegui un premio', 'gane una competencia' ] },
	{ id: 'spouse_work_change', label: 'Spouse begins or stops work', sourced: true, impact: 26, valence: -0.1, dominance: -0.1, area: [ 'Logic', 'Affect' ], keywords: [ 'mi pareja empezo a trabajar', 'mi pareja dejo su trabajo' ] },
	{ id: 'school_begin_end', label: 'Begin or end school', sourced: true, impact: 26, valence: 0.2, dominance: 0.1, area: [ 'Drive', 'Logic' ], keywords: [ 'empiezo la universidad', 'me gradue', 'termine mis estudios' ] },
	{ id: 'living_conditions_change', label: 'Change in living conditions', sourced: true, impact: 25, valence: -0.2, dominance: -0.2, area: [ 'Affect', 'Restraint' ], keywords: [ 'cambio en mi casa', 'estamos remodelando' ] },
	{ id: 'personal_habits_revision', label: 'Revision of personal habits', sourced: true, impact: 24, valence: -0.1, dominance: 0.1, area: [ 'Drive', 'Restraint' ], keywords: [ 'cambie mis habitos', 'dejando un vicio' ] },
	{ id: 'trouble_with_boss', label: 'Trouble with boss', sourced: true, impact: 23, valence: -0.5, dominance: -0.4, area: [ 'Restraint', 'Ego' ], keywords: [ 'problemas con mi jefe', 'mi jefe me grito', 'discusion con mi jefe' ] },
	{ id: 'work_hours_change', label: 'Change in work hours or conditions', sourced: true, impact: 20, valence: -0.1, dominance: -0.2, area: [ 'Logic', 'Restraint' ], keywords: [ 'cambio de horario de trabajo', 'turno nuevo' ] },
	{ id: 'residence_change', label: 'Change in residence', sourced: true, impact: 20, valence: -0.1, dominance: -0.1, area: [ 'Affect', 'Logic' ], keywords: [ 'me mude de casa', 'cambio de residencia' ] },
	{ id: 'school_change', label: 'Change in schools', sourced: true, impact: 20, valence: -0.1, dominance: -0.2, area: [ 'Empathy', 'Echo' ], keywords: [ 'cambio de escuela', 'nuevo colegio' ] },
	{ id: 'recreation_change', label: 'Change in recreation', sourced: true, impact: 19, valence: 0.1, dominance: 0.0, area: [ 'Affect' ], keywords: [ 'empece un nuevo hobby', 'deje de hacer deporte' ] },
	{ id: 'church_activities_change', label: 'Change in church activities', sourced: true, impact: 19, valence: 0.0, dominance: 0.0, area: [ 'Affect' ], keywords: [ 'cambio en mi fe', 'deje de ir a la iglesia' ] },
	{ id: 'social_activities_change', label: 'Change in social activities', sourced: true, impact: 18, valence: 0.0, dominance: 0.0, area: [ 'Empathy', 'Affect' ], keywords: [ 'cambio en mi vida social' ] },
	{ id: 'minor_mortgage_loan', label: 'Minor mortgage or loan', sourced: true, impact: 17, valence: -0.1, dominance: -0.2, area: [ 'Logic' ], keywords: [ 'pedi un prestamo pequeno' ] },
	{ id: 'sleeping_habits_change', label: 'Change in sleeping habits', sourced: true, impact: 16, valence: -0.1, dominance: -0.1, area: [ 'Affect', 'Restraint' ], keywords: [ 'duermo mal ultimamente', 'cambie mis horarios de sueno' ] },
	{ id: 'family_gettogethers_change', label: 'Change in number of family get-togethers', sourced: true, impact: 15, valence: 0.1, dominance: 0.0, area: [ 'Empathy' ], keywords: [ 'menos reuniones familiares', 'mas reuniones familiares' ] },
	{ id: 'eating_habits_change', label: 'Change in eating habits', sourced: true, impact: 15, valence: -0.1, dominance: 0.0, area: [ 'Affect', 'Restraint' ], keywords: [ 'cambie mi dieta', 'como diferente ahora' ] },
	{ id: 'vacation', label: 'Vacation', sourced: true, impact: 13, valence: 0.5, dominance: 0.3, area: [ 'Affect' ], keywords: [ 'me voy de vacaciones', 'estoy de vacaciones' ] },
	{ id: 'christmas', label: 'Christmas / holidays', sourced: true, impact: 12, valence: 0.3, dominance: 0.0, area: [ 'Affect', 'Empathy' ], keywords: [ 'es navidad', 'fiestas decembrinas' ] },
	{ id: 'minor_law_violation', label: 'Minor violation of the law', sourced: true, impact: 11, valence: -0.3, dominance: -0.3, area: [ 'Ego', 'Logic' ], keywords: [ 'me pusieron una multa', 'infraccion de transito' ] },

	{ id: 'severe_physical_violence_victim', label: 'Victim of severe physical violence', sourced: false, impact: 90, valence: -1.0, dominance: -1.0, area: [ 'Ego', 'Affect', 'Intuition' ], keywords: [ 'me golpearon', 'sufri violencia fisica', 'me atacaron fisicamente' ] },
	{ id: 'surviving_severe_accident', label: 'Surviving a severe accident', sourced: false, impact: 85, valence: -0.9, dominance: -1.0, area: [ 'Intuition', 'Restraint' ], keywords: [ 'tuve un accidente grave', 'casi muero en un accidente', 'sobrevivi a un accidente' ] },
	{ id: 'witnessing_fatal_accident', label: 'Witnessing a fatal accident', sourced: false, impact: 70, valence: -0.8, dominance: -0.7, area: [ 'Empathy', 'Engram' ], keywords: [ 'vi como alguien moria', 'presencie un accidente fatal' ] },
	{ id: 'public_humiliation', label: 'Public humiliation', sourced: false, impact: 55, valence: -0.8, dominance: -0.6, area: [ 'Ego', 'Echo' ], keywords: [ 'me humillaron delante de todos', 'me avergonzaron en publico' ] },
	{ id: 'credible_verbal_threat', label: 'Credible direct verbal threat', sourced: false, impact: 50, valence: -0.7, dominance: -0.5, area: [ 'Intuition', 'Focus' ], keywords: [ 'me amenazaron', 'te voy a hacer dano', 'te vas a arrepentir' ] },
	{ id: 'discovering_partner_lie', label: 'Discovering a significant lie from a partner', sourced: false, impact: 48, valence: -0.6, dominance: -0.3, area: [ 'Ethos', 'Appraisal' ], keywords: [ 'me mintio mi pareja', 'descubri que me mintio' ] },
	{ id: 'minor_physical_fight', label: 'Minor physical fight', sourced: false, impact: 40, valence: -0.6, dominance: -0.1, area: [ 'Intuition', 'Affect' ], keywords: [ 'tuve una pelea', 'nos peleamos fisicamente' ] },
	{ id: 'unexpected_love_declaration', label: 'Reciprocated declaration of love', sourced: false, impact: 38, valence: 0.9, dominance: 0.4, area: [ 'Ego', 'Affect' ], keywords: [ 'me dijo que me ama', 'nos declaramos amor' ] },
	{ id: 'unexpected_praise', label: 'Unexpected praise from a superior', sourced: false, impact: 35, valence: 0.7, dominance: 0.5, area: [ 'Ego', 'Drive' ], keywords: [ 'mi jefe me elogio', 'recibi un elogio inesperado' ] },
	{ id: 'traffic_jam_severe', label: 'Stuck in severe traffic', sourced: false, impact: 20, valence: -0.4, dominance: -0.8, area: [ 'Restraint', 'Affect' ], keywords: [ 'atascado en el trafico', 'llevo una hora en el trafico' ] },
	{ id: 'lost_keys_wallet', label: 'Temporarily losing keys or wallet', sourced: false, impact: 15, valence: -0.3, dominance: -0.4, area: [ 'Focus', 'Intuition' ], keywords: [ 'perdi mis llaves', 'perdi mi cartera', 'no encuentro mis llaves' ] },
	{ id: 'message_ignored', label: 'Being ignored on a key message', sourced: false, impact: 12, valence: -0.2, dominance: -0.3, area: [ 'Echo', 'Ego' ], keywords: [ 'me dejaste en visto', 'no me respondiste el mensaje' ] },
	{ id: 'tech_failure_minor', label: 'Minor technical failure', sourced: false, impact: 10, valence: -0.4, dominance: -0.5, area: [ 'Logic', 'Affect' ], keywords: [ 'se borro el archivo', 'fallo el sistema', 'perdi mi trabajo sin guardar' ] },

]

function normalize( text ) {

	return ( text || '' ).toLowerCase()

}

export class LifeEventCatalog {

	detect( text ) {

		const lower = normalize( text )
		return LIFE_EVENTS.filter( event => event.keywords.some( phrase => lower.includes( phrase ) ) )

	}

	triangulate( matches ) {

		if ( !matches.length ) return null
		if ( matches.length === 1 ) {

			const [ only ] = matches
			return { impact: only.impact, valence: only.valence, dominance: only.dominance, area: only.area, events: [ only.id ] }

		}

		const totalWeight = matches.reduce( ( sum, e ) => sum + e.impact, 0 )
		const valence = matches.reduce( ( sum, e ) => sum + e.valence * e.impact, 0 ) / totalWeight
		const dominance = matches.reduce( ( sum, e ) => sum + e.dominance * e.impact, 0 ) / totalWeight
		const impact = Math.max( ...matches.map( e => e.impact ) )
		const area = [ ...new Set( matches.flatMap( e => e.area ) ) ]

		return { impact, valence, dominance, area, events: matches.map( e => e.id ) }

	}

}
