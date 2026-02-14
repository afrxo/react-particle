import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { Attachment } from "../components/attachment";
import { Emitter } from "../components/emitter";

const story = CreateReactStory(
  {
    react: React,
    reactRoblox: ReactRoblox,
    controls: {},
  },
  () => {
    return (
      <frame
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
      >
        <Attachment position={UDim2.fromScale()}>
          <Emitter
            rate={20}
            spread={360}
            speed={150}
            lifetime={[2, 4]}
            acceleration={new Vector2(0, 200)}
            size={new NumberSequence(8)}
          />
        </Attachment>
      </frame>
    );
  },
);

export = story;
