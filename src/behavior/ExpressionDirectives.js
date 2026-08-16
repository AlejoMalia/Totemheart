/**
 * Consolidates 4 requested "physiological output" mechanisms (facial Action
 * Units, vocal prosody, body kinematics/posture, and instinctive action
 * tendency) into ONE honest module: **directives for an external renderer**
 * (an avatar rig, a TTS engine, a robot), not measurements Totemheart itself
 * produces — this library has no camera, no speaker, no motors. Four related
 * biometric *sensing* channels from the same request (pupil dilation, skin
 * conductance/EDA, heart-rate variability, facial blood-flow/thermography)
 * are deliberately NOT implemented here or anywhere else: those are things a
 * human body is measured producing, not something any software — embodied
 * or not — generates. Faking sensor readings with no sensor behind them
 * would be exactly the kind of theater this project has avoided throughout.
 * See CALIBRATION.md.
 */
function clamp01( v ) {

	return Math.max( 0, Math.min( 1, v ) )

}

function softmax( scores ) {

	const values = Object.values( scores )
	const max      = Math.max( ...values )
	const exps      = Object.fromEntries( Object.entries( scores ).map( ( [ k, v ] ) => [ k, Math.exp( v - max ) ] ) )
	const total      = Object.values( exps ).reduce( ( a, b ) => a + b, 0 )
	return Object.fromEntries( Object.entries( exps ).map( ( [ k, v ] ) => [ k, v / total ] ) )

}

/**
 * FACS (Facial Action Coding System, Ekman & Friesen) prototype Action Units
 * per emotion — the specific AU combinations for "basic" emotions are widely
 * reproduced in the affective-computing literature; treat these as the
 * commonly-cited prototypes, not a verified primary-source transcription.
 */
const FACS_PROTOTYPES = {
	joy         : [ 'AU6', 'AU12' ],
	sadness     : [ 'AU1', 'AU4', 'AU15' ],
	fear        : [ 'AU1', 'AU2', 'AU4', 'AU5', 'AU20', 'AU26' ],
	anger       : [ 'AU4', 'AU5', 'AU7', 'AU23' ],
	surprise    : [ 'AU1', 'AU2', 'AU5', 'AU26' ],
	disgust     : [ 'AU9', 'AU15', 'AU16' ],
	neutral     : [],
}

export class ExpressionDirectives {

	/** Facial Action Units (item 25) with intensity 0-5, derived from the dominant emotion's blend weight. */
	getFacialDirectives( dominantEmotion, intensityWeight = 1 ) {

		const units = FACS_PROTOTYPES[ dominantEmotion ] ?? FACS_PROTOTYPES.neutral
		const intensity = Math.round( clamp01( intensityWeight ) * 5 )
		return units.map( au => ( { unit: au, intensity } ) )

	}

	/** Vocal prosody targets (item 26) — pitch/rate/energy deltas for a TTS engine, not synthesized audio. */
	getProsodyDirectives( { valence, arousal } ) {

		return {
			pitchShift  : arousal * 0.3,               // fraction above/below baseline F0
			rateShift   : arousal * 0.2,               // fraction faster/slower than baseline
			energyLevel : clamp01( ( arousal + 1 ) / 2 ), // 0..1 loudness/intensity target
			breathiness : valence < -0.3 ? clamp01( -valence * 0.4 ) : 0, // sadness/despair reads breathier
		}

	}

	/** Posture/kinematics descriptor (item 27) — classic approach/withdraw/freeze mapping, not joint coordinates. */
	getPostureDirectives( { valence, arousal, dominance } ) {

		let stance = 'neutral'
		if ( arousal > 0.5 && valence < -0.3 && dominance < -0.2 ) stance = 'freeze'
		else if ( valence < -0.2 ) stance = 'withdraw'
		else if ( valence > 0.2 ) stance = 'approach'

		return { stance, openness: clamp01( ( dominance + 1 ) / 2 ) } // low dominance -> closed/hunched posture target

	}

	/** Action tendency (item 32) — real softmax over a small instinctive action set. */
	getActionTendency( { valence, arousal, dominance } ) {

		const scores = {
			approach : valence * 2 + dominance,
			withdraw : -valence * 1.5 - dominance * 0.5,
			freeze   : arousal * ( dominance < 0 ? 1.5 : 0.2 ) - Math.abs( valence ) * 0.3,
			engage   : dominance * 1.5 + arousal * 0.5,
		}
		return softmax( scores )

	}

}
