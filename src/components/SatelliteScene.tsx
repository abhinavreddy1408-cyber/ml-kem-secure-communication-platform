import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function OrbitingSatellite({ isBreach }: { isBreach: boolean }) {
  const satelliteRef = useRef<THREE.Group>(null);
  const orbitRadius = 4;
  const orbitSpeed = 0.5;

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * orbitSpeed;
    if (satelliteRef.current) {
      satelliteRef.current.position.x = Math.cos(t) * orbitRadius;
      satelliteRef.current.position.z = Math.sin(t) * orbitRadius;
      satelliteRef.current.position.y = Math.sin(t * 0.5) * 1.5; // Slight vertical oscillation
      satelliteRef.current.rotation.y = -t + Math.PI / 2; // Face the direction of travel
    }
  });

  return (
    <group ref={satelliteRef}>
      {/* Satellite Body */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.4, 0.6]} />
        <meshStandardMaterial 
          color={isBreach ? "#FF4444" : "#A0AEC0"} 
          metalness={0.9} 
          roughness={0.1} 
          emissive={isBreach ? "#FF0000" : "#000000"}
          emissiveIntensity={isBreach ? 2 : 0}
        />
      </mesh>
      
      {/* Solar Panels */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.4]} />
        <meshStandardMaterial color="#2D3748" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.4]} />
        <meshStandardMaterial color="#2D3748" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#718096" />
      </mesh>

      {/* Breach Particles / Glow */}
      {isBreach && (
        <group>
          {[...Array(5)].map((_, i) => (
            <Float key={i} speed={5} rotationIntensity={2} floatIntensity={2}>
              <mesh position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color="#FF0000" transparent opacity={0.6} />
              </mesh>
            </Float>
          ))}
        </group>
      )}
    </group>
  );
}

function CentralNode({ isBreach }: { isBreach: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const latticeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
    }
    if (latticeRef.current) {
      latticeRef.current.rotation.y = -t * 0.1;
      latticeRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
    }
  });

  const latticePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      points.push(new THREE.Vector3().setFromSphericalCoords(
        2.5,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      ));
    }
    return points;
  }, []);

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color={isBreach ? "#E41D3D" : "#0F1723"}
            roughness={0.1}
            metalness={0.8}
            distort={0.3}
            speed={2}
          />
        </Sphere>
      </Float>

      <group ref={latticeRef}>
        {latticePoints.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={isBreach ? "#E41D3D" : "#00FFFF"} />
          </mesh>
        ))}
        {/* Simple lines connecting points */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={latticePoints.length * 2}
              array={new Float32Array(latticePoints.flatMap(p => [p.x, p.y, p.z, 0, 0, 0]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={isBreach ? "#E41D3D" : "#00FFFF"} transparent opacity={0.2} />
        </lineSegments>
      </group>
      
      <OrbitingSatellite isBreach={isBreach} />
    </group>
  );
}

export function SatelliteScene({ isBreach }: { isBreach: boolean }) {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <CentralNode isBreach={isBreach} />
      </Canvas>
    </div>
  );
}

