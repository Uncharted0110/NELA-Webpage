'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Stars, Trail, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'motion/react';

// Deterministic pseudo-random function
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

function Pathway({ 
  curve, 
  color, 
  scrollYProgress, 
  offset, 
  speedMultiplier 
}: { 
  curve: THREE.CatmullRomCurve3, 
  color: string, 
  scrollYProgress: MotionValue<number>,
  offset: number,
  speedMultiplier: number
}) {
  const points = useMemo(() => curve.getPoints(200), [curve]);
  const impulseRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (impulseRef.current) {
      const scrollT = scrollYProgress.get();
      // Calculate position along curve with offset and speed
      let t = (scrollT * speedMultiplier + offset) % 1;
      if (t < 0) t += 1; // Ensure positive
      
      const impulsePos = curve.getPoint(t);
      impulseRef.current.position.copy(impulsePos);
    }
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.2} />
      <Trail width={2} color={color} length={10} decay={1} local={false}>
        <mesh ref={impulseRef}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color={color} intensity={2} distance={5} />
        </mesh>
      </Trail>
    </group>
  );
}

function Scene({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const cameraGroupRef = useRef<THREE.Group>(null);

  // Generate multiple curvy paths
  const pathways = useMemo(() => {
    const paths = [];
    const colors = ['#00ffcc', '#ec4899', '#3b82f6', '#a855f7'];
    
    for (let i = 0; i < 8; i++) {
      const points = [];
      let currentY = 15;
      for (let j = 0; j < 10; j++) {
        points.push(new THREE.Vector3(
          (pseudoRandom(i * 100 + j) - 0.5) * 30,
          currentY,
          (pseudoRandom(i * 200 + j) - 0.5) * 20 - 10
        ));
        currentY -= 8;
      }
      paths.push({
        curve: new THREE.CatmullRomCurve3(points),
        color: colors[i % colors.length],
        offset: pseudoRandom(i * 300),
        speedMultiplier: 0.5 + pseudoRandom(i * 400) * 1.5
      });
    }
    return paths;
  }, []);

  // Central camera path
  const cameraCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 15, 0),
      new THREE.Vector3(-2, 5, -2),
      new THREE.Vector3(3, -5, -4),
      new THREE.Vector3(-1, -15, -1),
      new THREE.Vector3(2, -25, -5),
      new THREE.Vector3(0, -35, -2),
      new THREE.Vector3(0, -45, 0),
    ]);
  }, []);

  // Generate nodes (synapses)
  const nodes = useMemo(() => {
    const n = [];
    for (let i = 0; i < 50; i++) {
      n.push({
        pos: new THREE.Vector3(
          (pseudoRandom(i * 500) - 0.5) * 40,
          15 - pseudoRandom(i * 600) * 60,
          (pseudoRandom(i * 700) - 0.5) * 30 - 5
        ),
        size: 0.05 + pseudoRandom(i * 800) * 0.15,
        color: ['#00ffcc', '#ec4899', '#3b82f6'][Math.floor(pseudoRandom(i * 900) * 3)]
      });
    }
    return n;
  }, []);

  useFrame(() => {
    const t = scrollYProgress.get(); // 0 to 1
    
    // Move camera down the central path
    if (cameraGroupRef.current) {
      const camPos = cameraCurve.getPoint(t);
      
      cameraGroupRef.current.position.lerp(
        new THREE.Vector3(camPos.x * 0.5, camPos.y, camPos.z + 10), 
        0.05
      );
      
      cameraGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.z,
        (camPos.x * 0.02),
        0.05
      );
      cameraGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.x,
        (camPos.z * 0.01),
        0.05
      );
    }
  });

  return (
    <>
      <group ref={cameraGroupRef}>
        <perspectiveCamera makeDefault position={[0, 0, 0]} fov={60} />
      </group>

      {/* Pathways with Impulses */}
      {pathways.map((path, i) => (
        <Pathway 
          key={i} 
          curve={path.curve} 
          color={path.color} 
          scrollYProgress={scrollYProgress} 
          offset={path.offset}
          speedMultiplier={path.speedMultiplier}
        />
      ))}

      {/* Floating Nodes */}
      {nodes.map((node, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={node.pos}>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function NeuralBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 40]} />
        <ambientLight intensity={0.2} />
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={1} fade speed={1} />
        <Scene scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
