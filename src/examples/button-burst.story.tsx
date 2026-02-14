import React, { useRef } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { Attachment } from "../components/attachment";
import { Emitter, type EmitterRef } from "../components/emitter";

const story = CreateReactStory(
  {
    react: React,
    reactRoblox: ReactRoblox,
    controls: {},
  },
  () => {
    const emitterRef = useRef<EmitterRef>();

    return (
      <frame
        AnchorPoint={Vector2.one.div(2)}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromScale(1, 1)}
        BackgroundTransparency={1}
      >
        <frame
          ZIndex={3}
          Position={UDim2.fromScale(0.5, 0.5)}
          AnchorPoint={Vector2.one.div(2)}
        >
          <Attachment position={UDim2.fromScale(0.5, 0.5)}>
            <Emitter
              ref={emitterRef}
              spread={360}
              rate={0}
              speed={[25, 500]}
              lifetime={[0.5, 3.5]}
              acceleration={new Vector2(0, 250)}
              size={
                new NumberSequence([
                  new NumberSequenceKeypoint(0, 8, 0.5),
                  new NumberSequenceKeypoint(0.65, 8, 0.5),
                  new NumberSequenceKeypoint(0.7, 0, 0.5),
                  new NumberSequenceKeypoint(1, 0, 0),
                ])
              }
            />
          </Attachment>
        </frame>

        <textbutton
          Text="Click for Particle Burst!"
          Size={UDim2.fromOffset(200, 50)}
          Position={UDim2.fromScale(0.5, 0.5)}
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundColor3={Color3.fromRGB(0, 170, 255)}
          TextColor3={Color3.fromRGB(255, 255, 255)}
          Font={Enum.Font.GothamBold}
          TextSize={16}
          Event={{
            Activated: () => emitterRef.current?.emit(50),
          }}
        >
          <uicorner CornerRadius={new UDim(0, 8)} />
        </textbutton>
      </frame>
    );
  },
);

export = story;
