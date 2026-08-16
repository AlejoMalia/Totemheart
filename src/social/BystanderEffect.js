/**
 * For group channels: the probability of intervening is inversely
 * proportional to the number of participants, unless the AI is mentioned
 * explicitly by name — same as the human bystander effect.
 */
export class BystanderEffect {

	shouldRespond( { participantCount = 1, mentionedExplicitly = false } = {} ) {

		if ( participantCount <= 1 || mentionedExplicitly ) return { respond: true, delayFactor: 1 }

		const probability = 1 / participantCount
		return { respond: Math.random() < probability, delayFactor: participantCount }

	}

}
