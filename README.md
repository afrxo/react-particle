# @rbxts/react-particle

A performant, flexible particle system for Roblox built with React and roblox-ts.

## Installation

```bash
npm install @rbxts/react-particle
```

```bash
pnpm add @rbxts/react-particle
```

## Usage

```tsx
import { Emitter, Attachment } from "@rbxts/react-particle";

<Attachment position={UDim2.fromScale(0.5, 0.5)}>
  <Emitter
    rate={50}
    spread={360}
    speed={100}
    lifetime={[1, 2]}
    size={new NumberSequence(10, 0)}
  />
</Attachment>
```

## API

### Emitter

Main component for spawning particles.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rate` | `number` | `150` | Particles per second (set to 0 for manual emission) |
| `angle` | `number` | `0` | Emission angle in degrees |
| `spread` | `number` | `0` | Spread angle in degrees |
| `speed` | `number` | `60` | Particle velocity |
| `lifetime` | `[number, number]` | `[1, 5]` | Min/max lifetime in seconds |
| `rotation` | `[number, number]` | `[-360, 360]` | Initial rotation range |
| `rotSpeed` | `number` | `48` | Rotation speed |
| `size` | `NumberSequence` | `new NumberSequence(5, 0)` | Size over lifetime |
| `transparency` | `NumberSequence` | `new NumberSequence(0)` | Transparency over lifetime |
| `acceleration` | `Vector2` | `Vector2.zero` | Gravity/acceleration |
| `drag` | `number` | `0` | Air resistance |
| `maxParticles` | `number` | `1000` | Pool size |
| `renderParticle` | `ComponentType` | - | Custom particle component |

Trigger particles manually:

```tsx
const emitterRef = useRef<EmitterRef>();
emitterRef.current?.emit(25);
```

### Attachment

Sets spawn position for emitters.

```tsx
<Attachment position={UDim2.fromScale(0.5, 0)}>
  <Emitter {...props} />
</Attachment>
```

## Examples

**Confetti**
```tsx
<Emitter
  rate={20}
  spread={360}
  speed={150}
  lifetime={[2, 4]}
  acceleration={new Vector2(0, 200)}
  size={new NumberSequence(8)}
/>
```

**Custom colored particles**
```tsx
const ColoredParticle = (props: ParticleProps) => {
  const color = useRef(Color3.fromHSV(math.random(), 0.8, 1));
  return (
    <Particle {...props}>
      <frame
        Size={UDim2.fromScale(1, 1)}
        BackgroundColor3={color.current}
        BorderSizePixel={0}
      >
        <uicorner CornerRadius={new UDim(1, 0)} />
      </frame>
    </Particle>
  );
};

<Emitter renderParticle={ColoredParticle} />
```

**Button click burst**
```tsx
const emitterRef = useRef<EmitterRef>();

<textbutton Event={{ Activated: () => emitterRef.current?.emit(50) }}>
  <Emitter ref={emitterRef} rate={0} spread={360} />
</textbutton>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Afrxzo](https://github.com/Afrxzo)
