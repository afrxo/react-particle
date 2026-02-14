import { useEventListener } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "@rbxts/react";
import { HttpService, RunService } from "@rbxts/services";
import { AttachmentContext } from "./attachment-context";
import { evaluateNumberSequence } from "../util/evaluate-number-sequence";
import { Particle } from "./particle";

interface ParticleData {
  id: string;
  life: number;
  lifetime: number;
  rotation: number;
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  alive: boolean;
}

export interface EmitterRef {
  emit: (amount?: number) => void;
}

export interface ParticleProps {
  id: string;
  size: Vector2;
  rotation: number;
  position: Vector2;
  alpha: number;
}

interface EmitterProps {
  rate?: number;
  angle?: number;
  speed?: number | [number, number];
  size?: NumberSequence;
  rotation?: number | [number, number];
  rotSpeed?: number;
  lifetime?: [number, number];
  spread?: number;
  acceleration?: Vector2;
  drag?: number;
  transparency?: NumberSequence;
  renderParticle?: React.ComponentType<ParticleProps>;
  maxParticles?: number;
}

function randomInRange(min: number, max: number): number {
  if (min > max) throw "Min must be less than max";
  if (min === max) return min;
  return math.random(min, max);
}

export const Emitter = forwardRef<EmitterRef, EmitterProps>(
  (
    {
      angle = 0,
      rate = 150,
      speed = 60,
      rotation = [-360, 360],
      rotSpeed = 48,
      size = new NumberSequence(5, 0),
      lifetime = [1, 5],
      transparency = new NumberSequence(0),
      spread = 0,
      acceleration = new Vector2(0, 0),
      drag = 0,
      renderParticle,
      maxParticles = 1000,
    },
    ref,
  ) => {
    const frameRef = useRef<Frame>();
    const attachmentPosition = useContext(AttachmentContext);

    // Single source of truth for all particles
    const [particles, setParticles] = useState<ParticleData[]>([]);

    // Calculate spawn position from attachment or origin as fallback
    const getSpawnPosition = useCallback((): Vector2 => {
      const frame = frameRef.current;
      if (!frame) return Vector2.zero;

      const canvas = frame.AbsoluteSize;

      if (attachmentPosition) {
        return new Vector2(
          canvas.X * attachmentPosition.X.Scale + attachmentPosition.X.Offset,
          canvas.Y * attachmentPosition.Y.Scale + attachmentPosition.Y.Offset,
        );
      }

      return Vector2.zero;
    }, [attachmentPosition]);

    // Spawn new particles
    const spawn = useCallback(
      (amount: number = 1) => {
        const origin = getSpawnPosition();

        setParticles((current) => {
          const updated = [...current];

          for (let i = 0; i < amount; i++) {
            // Try to reuse a dead particle slot (object pooling)
            let particle = updated.find((p) => !p.alive);

            // Create new particle if no dead slots available and under limit
            if (!particle && updated.size() < maxParticles) {
              particle = {
                id: HttpService.GenerateGUID(false),
                life: 0,
                lifetime: 0,
                rotation: 0,
                position: Vector2.zero,
                velocity: Vector2.zero,
                acceleration: Vector2.zero,
                alive: false,
              };
              updated.push(particle);
            }

            // Can't spawn if at max capacity
            if (!particle) break;

            // Calculate velocity direction with spread
            const baseAngle = math.rad(angle);
            const spreadOffset = math.rad(
              randomInRange(-spread / 2, spread / 2),
            );
            const finalAngle = baseAngle + spreadOffset;
            const direction = new Vector2(
              math.cos(finalAngle),
              math.sin(finalAngle),
            );

            // Initialize particle
            particle.life = 0;
            particle.lifetime = randomInRange(lifetime[0], lifetime[1]);
            particle.rotation = typeIs(rotation, "table")
              ? randomInRange(rotation[0], rotation[1])
              : rotation;
            particle.position = origin;
            const particleSpeed = typeIs(speed, "table")
              ? randomInRange(speed[0], speed[1])
              : speed;
            particle.velocity = direction.mul(particleSpeed);
            particle.acceleration = acceleration;
            particle.alive = true;
          }

          return updated;
        });
      },
      [
        getSpawnPosition,
        angle,
        spread,
        lifetime,
        rotation,
        speed,
        acceleration,
        maxParticles,
      ],
    );

    useImperativeHandle(ref, () => ({ emit: spawn }), [spawn]);

    // Automatic emission based on rate
    const emitAccumulator = useRef(0);
    useEventListener(RunService.RenderStepped, (dt) => {
      if (rate === 0) return;

      emitAccumulator.current += dt;
      const interval = 1 / rate;

      while (emitAccumulator.current >= interval) {
        spawn(1);
        emitAccumulator.current -= interval;
      }
    });

    // Update particle physics each frame
    useEventListener(RunService.Heartbeat, (dt) => {
      setParticles((current) => {
        if (current.size() === 0) return current;

        const updated = [...current];

        for (const particle of updated) {
          if (!particle.alive) continue;

          // Age the particle
          particle.life += dt;

          // Kill if lifetime exceeded
          if (particle.life >= particle.lifetime) {
            particle.alive = false;
            continue;
          }

          // Apply acceleration
          particle.velocity = particle.velocity.add(
            particle.acceleration.mul(dt),
          );

          // Apply drag
          if (drag > 0) {
            const damping = math.exp(-drag * dt);
            particle.velocity = particle.velocity.mul(damping);
          }

          // Update position and rotation
          particle.position = particle.position.add(particle.velocity.mul(dt));
          particle.rotation += rotSpeed * dt;
        }

        return updated;
      });
    });

    return (
      <frame
        ref={frameRef}
        Size={UDim2.fromScale(1, 1)}
        AnchorPoint={Vector2.one.div(2)}
        Position={UDim2.fromScale(0.5, 0.5)}
        BackgroundTransparency={1}
      >
        {particles
          .filter((p) => p.alive)
          .map((p) => {
            const lifeProgress = math.clamp(p.life / p.lifetime, 0, 1);

            const props: ParticleProps = {
              id: p.id,
              position: p.position,
              rotation: p.rotation,
              size: Vector2.one.mul(evaluateNumberSequence(size, lifeProgress)),
              alpha: evaluateNumberSequence(transparency, lifeProgress),
            };

            if (renderParticle) {
              const CustomParticle = renderParticle;
              return <CustomParticle {...props} key={p.id} />;
            }

            return <Particle {...props} key={p.id} />;
          })}
      </frame>
    );
  },
);
