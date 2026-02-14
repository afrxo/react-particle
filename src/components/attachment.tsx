import React from "@rbxts/react";
import { AttachmentContext } from "./attachment-context";

interface AttachmentProps extends React.PropsWithChildren {
	position: UDim2;
}

export function Attachment({ position, children }: AttachmentProps) {
	return (
		<AttachmentContext.Provider value={position}>
			{children}
		</AttachmentContext.Provider>
	);
}
