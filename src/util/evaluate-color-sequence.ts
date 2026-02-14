export function evaluateColorSequence(sequence: ColorSequence, t: number): Color3 {
	if (t === 0) return sequence.Keypoints[0].Value;
	if (t === 1) {
		const keypoints = sequence.Keypoints;
		return keypoints[keypoints.size() - 1].Value;
	}

	for (let i = 0; i < sequence.Keypoints.size() - 1; i++) {
		const current = sequence.Keypoints[i];
		const following = sequence.Keypoints[i + 1];

		if (t >= current.Time && t < following.Time) {
			const alpha = (t - current.Time) / (following.Time - current.Time);
			return current.Value.Lerp(following.Value, alpha);
		}
	}

	return sequence.Keypoints[0].Value;
}
