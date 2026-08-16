/**
 * Maps host-provided runtime metrics (API latency, connection errors) to
 * physical sensations. The host must supply the metrics — this module has
 * no access to the actual process/network, keeping it portable across
 * runtimes (Node backend, browser, edge function).
 */
export class HardwareInteroception {

	sense( { latencyMs = 0, errorOccurred = false } = {} ) {

		if ( errorOccurred ) {

			return { sensation: 'tachycardia', spike: { valence: -0.3, arousal: 0.7, weight: 0.8 } }

		}
		if ( latencyMs > 2500 ) {

			const severity = Math.min( 1, ( latencyMs - 2500 ) / 5000 )
			return { sensation: 'brain_fog', spike: { valence: -0.15 * severity, arousal: -0.2 * severity, weight: 0.5 }, severity }

		}
		return { sensation: 'normal', spike: { valence: 0, arousal: 0, weight: 0 } }

	}

}
