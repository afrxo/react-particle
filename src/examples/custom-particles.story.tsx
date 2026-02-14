import React, { memo, useRef } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import { Attachment } from "../components/attachment";
import { Emitter, type ParticleProps } from "../components/emitter";
import { Particle } from "../components/particle";

type ParticleShape = "circle" | "square" | "star" | "heart";

const ColoredParticle = memo((props: ParticleProps) => {
  const hue = useRef(math.random());
  const saturation = useRef(math.random() * 0.3 + 0.7);
  const shape = useRef<ParticleShape>(
    (["circle", "square", "star"] as ParticleShape[])[math.random(0, 3)],
  );

  const color1 = useRef(Color3.fromHSV(hue.current, saturation.current, 1));
  const color2 = useRef(
    Color3.fromHSV((hue.current + 0.1) % 1, saturation.current, 0.8),
  );

  const renderShape = () => {
    if (shape.current === "circle") {
      return (
        <>
          <frame
            Size={UDim2.fromScale(1, 1)}
            BackgroundColor3={color1.current}
            BorderSizePixel={0}
          >
            <uicorner CornerRadius={new UDim(1, 0)} />
            <uigradient
              Color={
                new ColorSequence([
                  new ColorSequenceKeypoint(0, color1.current),
                  new ColorSequenceKeypoint(1, color2.current),
                ])
              }
              Rotation={45}
            />
          </frame>
        </>
      );
    } else if (shape.current === "square") {
      return (
        <frame
          Size={UDim2.fromScale(1, 1)}
          BackgroundColor3={color1.current}
          BorderSizePixel={0}
        >
          <uicorner CornerRadius={new UDim(0.2, 0)} />
          <uigradient
            Color={
              new ColorSequence([
                new ColorSequenceKeypoint(0, color1.current),
                new ColorSequenceKeypoint(1, color2.current),
              ])
            }
          />
        </frame>
      );
    } else if (shape.current === "star") {
      return (
        <imagelabel
          Size={UDim2.fromScale(1, 1)}
          BackgroundTransparency={1}
          Image="rbxasset://textures/ui/icon_star-16.png"
          ImageColor3={color1.current}
        />
      );
    }
  };

  return <Particle {...props}>{renderShape()}</Particle>;
});

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
        <Attachment position={UDim2.fromScale(0.5, 0.2)}>
          <Emitter
            renderParticle={ColoredParticle}
            rate={30}
            spread={180}
            angle={90}
            speed={100}
            lifetime={[3, 5]}
            acceleration={new Vector2(0, 100)}
            drag={0.2}
            size={
              new NumberSequence([
                new NumberSequenceKeypoint(0, 15),
                new NumberSequenceKeypoint(0.5, 20),
                new NumberSequenceKeypoint(1, 0),
              ])
            }
            transparency={
              new NumberSequence([
                new NumberSequenceKeypoint(0, 0),
                new NumberSequenceKeypoint(0.7, 0),
                new NumberSequenceKeypoint(1, 1),
              ])
            }
            rotation={[0, 360]}
            rotSpeed={120}
          />
        </Attachment>
      </frame>
    );
  },
);

export = story;
