import React, { memo } from "@rbxts/react";

export interface ParticleComponentProps extends React.PropsWithChildren {
	id: string;
	size: Vector2;
	alpha: number;
	rotation: number;
	position: Vector2;
}

export const Particle = memo(({
	id,
	size,
	alpha,
	position,
	rotation,
	children,
}: ParticleComponentProps) => {
	return (
		<frame
			key={id}
			Rotation={rotation}
			Position={new UDim2(0, position.X, 0, position.Y)}
			Size={UDim2.fromOffset(size.X, size.Y)}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={children ? 1 : alpha}
			BorderSizePixel={0}
		>
			{children}
		</frame>
	);
});
