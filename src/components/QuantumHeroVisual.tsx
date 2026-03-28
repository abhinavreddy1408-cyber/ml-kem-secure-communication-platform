import { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue, useTransform } from 'motion/react';

type SystemState = 
  | 'IDLE' 
  | 'THREAT_DETECTED' 
  | 'SECURE_HANDSHAKE' 
  | 'KEY_EXCHANGE' 
  | 'SECURE_TRANSMISSION' 
  | 'ATTACK_SIMULATION' 
  | 'CRYPTO_AGILITY' 
  | 'STABLE_SECURE';

const sharedColor = new THREE.Color();
const sharedEmissive = new THREE.Color();

const QuantumCore = memo(({ scrollProgress, systemState }: { scrollProgress?: MotionValue<number>, systemState: SystemState }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const ring4Ref = useRef<THREE.Mesh>(null);

  const fallbackProgress = useMemo(() => new MotionValue(0), []);
  const cameraZ = useTransform(scrollProgress || fallbackProgress, [0, 1], [12, -5]);

  // Pre-calculate colors to avoid object creation in useFrame
  const colors = useMemo(() => ({
    IDLE: { color: "#FDFCF8", emissive: "#C5A059", distort: 0.4, speed: 1.5 },
    THREAT_DETECTED: { color: "#D67D7D", emissive: "#D67D7D", distort: 0.7, speed: 3 },
    ATTACK_SIMULATION: { color: "#D67D7D", emissive: "#D67D7D", distort: 0.8, speed: 4 },
    SECURE_HANDSHAKE: { color: "#FFFFFF", emissive: "#C5A059", distort: 0.6, speed: 2.5 },
    KEY_EXCHANGE: { color: "#FFFFFF", emissive: "#C5A059", distort: 0.6, speed: 3 },
    SECURE_TRANSMISSION: { color: "#FDFCF8", emissive: "#88A070", distort: 0.2, speed: 1 },
    STABLE_SECURE: { color: "#FDFCF8", emissive: "#88A070", distort: 0.2, speed: 1 },
    CRYPTO_AGILITY: { color: "#C5A059", emissive: "#88A070", distort: 0.5, speed: 2 },
  }), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Animate camera based on scroll
    if (scrollProgress) {
      state.camera.position.z = cameraZ.get();
    }

    if (meshRef.current) {
      const rotationSpeed = systemState === 'SECURE_HANDSHAKE' || systemState === 'KEY_EXCHANGE' ? 0.6 : 0.15;
      meshRef.current.rotation.y = t * rotationSpeed;
      meshRef.current.rotation.z = t * 0.04;
    }

    if (materialRef.current) {
      const config = colors[systemState] || colors.IDLE;
      
      // Special case for crypto agility flickering
      let targetColor = config.color;
      let targetEmissive = config.emissive;
      if (systemState === 'CRYPTO_AGILITY') {
        targetColor = t % 1 > 0.5 ? "#C5A059" : "#88A070";
        targetEmissive = t % 1 > 0.5 ? "#88A070" : "#C5A059";
      }

      sharedColor.set(targetColor);
      sharedEmissive.set(targetEmissive);
      materialRef.current.color.lerp(sharedColor, 0.08);
      materialRef.current.emissive.lerp(sharedEmissive, 0.08);
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, config.distort, 0.08);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, config.speed, 0.08);
    }

    // Optimized ring rotations
    const ringT = t * 0.1;
    if (ring1Ref.current) { ring1Ref.current.rotation.x = ringT * 3; ring1Ref.current.rotation.y = ringT; }
    if (ring2Ref.current) { ring2Ref.current.rotation.y = ringT * 2.5; ring2Ref.current.rotation.z = ringT; }
    if (ring3Ref.current) { ring3Ref.current.rotation.x = ringT * 1.5; ring3Ref.current.rotation.z = ringT * 2; }
    if (ring4Ref.current) { ring4Ref.current.rotation.x = ringT; ring4Ref.current.rotation.y = ringT * 3; }
  });

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
        <Sphere ref={meshRef} args={[1.4, 64, 64]}> {/* Reduced segments for performance */}
          <MeshDistortMaterial
            ref={materialRef}
            color="#FDFCF8"
            roughness={0.1}
            metalness={0.8}
            distort={0.4}
            speed={1.5}
            emissive="#C5A059"
            emissiveIntensity={0.4}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Float>

      <Torus ref={ring1Ref} args={[2.5, 0.005, 8, 60]}>
        <meshBasicMaterial color="#C5A059" transparent opacity={0.2} />
      </Torus>
      <Torus ref={ring2Ref} args={[3.2, 0.004, 8, 60]} rotation={[Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color="#A08C7D" transparent opacity={0.15} />
      </Torus>
      <Torus ref={ring3Ref} args={[4.0, 0.003, 8, 60]} rotation={[0, Math.PI / 6, 0]}>
        <meshBasicMaterial color="#8CA4AC" transparent opacity={0.1} />
      </Torus>
      <Torus ref={ring4Ref} args={[4.8, 0.002, 8, 60]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <meshBasicMaterial color="#C5A059" transparent opacity={0.05} />
      </Torus>

      <group>
        {Array.from({ length: 80 }).map((_, i) => ( // Reduced particle count
          <Particle key={i} systemState={systemState} />
        ))}
      </group>
    </group>
  );
});

const particleSharedColor = new THREE.Color();

const Particle = memo(({ systemState }: { systemState: SystemState }) => {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [pos, speed, size, defaultColor] = useMemo(() => {
    const p = new THREE.Vector3().setFromSphericalCoords(
      4 + Math.random() * 6,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );
    const colors = ["#C5A059", "#A08C7D", "#8CA4AC", "#FDFCF8"];
    return [
      p, 
      0.002 + Math.random() * 0.004, 
      0.008 + Math.random() * 0.012,
      colors[Math.floor(Math.random() * colors.length)]
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const multiplier = systemState === 'ATTACK_SIMULATION' ? 2.5 : 1;
      ref.current.position.x = pos.x + Math.sin(t * speed * multiplier + pos.y) * 1.1;
      ref.current.position.y = pos.y + Math.cos(t * speed * multiplier + pos.z) * 1.1;
      ref.current.position.z = pos.z + Math.sin(t * speed * multiplier + pos.x) * 1.1;
    }

    if (materialRef.current) {
      let targetColor = defaultColor;
      if (systemState === 'THREAT_DETECTED' || systemState === 'ATTACK_SIMULATION') targetColor = "#D67D7D";
      else if (systemState === 'SECURE_TRANSMISSION' || systemState === 'STABLE_SECURE') targetColor = "#88A070";
      particleSharedColor.set(targetColor);
      materialRef.current.color.lerp(particleSharedColor, 0.1);
    }
  });

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial ref={materialRef} color={defaultColor} transparent opacity={0.3} />
    </mesh>
  );
});

const QuantumHeroVisual = memo(({ scrollProgress, systemState = 'IDLE' }: { scrollProgress?: MotionValue<number>, systemState?: SystemState }) => {
  return (
    <div className="w-full h-full">
      <Canvas 
        dpr={[1, 1.5]} // Capped DPR for performance
        camera={{ position: [0, 0, 12], fov: 40 }}
        gl={{ antialias: false, powerPreference: "high-performance" }} // Optimized GL settings
      >
        <color attach="background" args={['#FDFCF8']} />
        <Stars radius={100} depth={50} count={600} factor={1.5} saturation={0} fade speed={0.4} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#FDFCF8" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#C5A059" />
        <QuantumCore scrollProgress={scrollProgress} systemState={systemState} />
      </Canvas>
    </div>
  );
});

export default QuantumHeroVisual;

