'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Environment, SoftShadows, Box, Cylinder, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ----------------------------------------------------
// 1. Abstract Architectural Scene
// ----------------------------------------------------
function ArchitecturalScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Create an abstract, clean premium structure
  // White/light grey materials, glass elements
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f5f5fa', roughness: 0.1, metalness: 0.1 }), []);
  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3b82f6', roughness: 0.3, metalness: 0.8 }), []);
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff', transmission: 1, opacity: 1, metalness: 0, roughness: 0.1, ior: 1.5, thickness: 1.0,
  }), []);

  // Animate the camera rig based on scroll
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // scroll.offset goes from 0 to 1
    const offset = scroll.offset;
    
    // Rotate building gently
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, offset * Math.PI * 2, 0.05);

    // Camera fly-through logic
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 15 - offset * 10, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 5 + Math.sin(offset * Math.PI) * 5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Foundation Platform */}
      <Box args={[20, 0.5, 20]} position={[0, -0.25, 0]} receiveShadow material={material} />
      
      {/* Central Core */}
      <Cylinder args={[2, 2, 10, 32]} position={[0, 5, 0]} castShadow receiveShadow material={glassMaterial} />
      <Cylinder args={[1.8, 1.8, 10.1, 32]} position={[0, 5, 0]} material={accentMaterial} />

      {/* Floating Platforms / Architecture */}
      <Box args={[12, 0.4, 6]} position={[-3, 3, 2]} castShadow receiveShadow material={material} />
      <Box args={[8, 0.4, 10]} position={[4, 6, -2]} castShadow receiveShadow material={material} />
      <Box args={[14, 0.4, 4]} position={[0, 9, 3]} castShadow receiveShadow material={material} />

      {/* Archways / Elements */}
      <Box args={[0.5, 6, 0.5]} position={[-7, 3, 4]} castShadow receiveShadow material={material} />
      <Box args={[0.5, 6, 0.5]} position={[-7, 3, 0]} castShadow receiveShadow material={material} />
      <Box args={[1, 0.5, 5]} position={[-7, 6, 2]} castShadow receiveShadow material={material} />
      
      {/* Accent Sphere */}
      <Sphere args={[1.5, 64, 64]} position={[5, 8.5, -4]} castShadow material={accentMaterial} />
      
      {/* Decorative Grid Columns */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} args={[0.2, 12, 0.2]} position={[8, 6, -8 + i * 2]} castShadow receiveShadow material={material} />
      ))}
    </group>
  );
}

// ----------------------------------------------------
// 2. HTML Text Overlays with Framer Motion
// ----------------------------------------------------
function HtmlContent() {
  const scroll = useScroll();
  const [page, setPage] = useState(0);

  useFrame(() => {
    // Determine which section we are in out of 4 total pages to trigger animations
    const currentPage = Math.floor(scroll.offset * scroll.pages);
    if (currentPage !== page) {
      setPage(currentPage);
    }
  });

  return (
    <div className="w-screen h-screen flex flex-col items-center pointer-events-none">
      
      {/* Section 1 */}
      <motion.div 
        className="absolute top-[30vh] left-[10vw] flex flex-col gap-4 max-w-xl"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: page === 0 ? 1 : 0, y: page === 0 ? 0 : -50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-6xl font-extrabold tracking-tighter text-slate-900 leading-tight">
          Geosite <span className="text-blue-600">DEVELOPERS</span>
        </h1>
        <p className="text-2xl text-slate-700 font-medium">
          A new dimension in web development.
        </p>
        <p className="text-lg text-slate-500">
          Scroll down to explore our immersive 3D architecture capabilities.
        </p>
      </motion.div>

      {/* Section 2 */}
      <motion.div 
        className="absolute top-[40vh] right-[10vw] flex flex-col gap-4 max-w-lg text-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: page === 1 ? 1 : 0, x: page === 1 ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-5xl font-bold text-slate-900">
          Structural <br /> Brilliance
        </h2>
        <p className="text-xl text-slate-600">
          Integrate highly detailed architectural assets directly into your web applications with native rendering performance.
        </p>
      </motion.div>

      {/* Section 3 */}
      <motion.div 
        className="absolute bottom-[20vh] left-[15vw] flex flex-col gap-4 max-w-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: page === 2 ? 1 : 0, y: page === 2 ? 0 : 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-5xl font-bold text-slate-900">
          Seamless UX
        </h2>
        <p className="text-xl text-slate-600">
          Use the power of ScrollControls and Framer Motion to tie HTML interfaces flawlessly to 3D environment transitions.
        </p>
      </motion.div>

    </div>
  );
}

// ----------------------------------------------------
// 3. Main Exported Component
// ----------------------------------------------------
export default function ScrollExperience() {
  return (
    <div className="w-full h-full bg-[#f8f9fa]">
      <Canvas shadows camera={{ position: [0, 5, 20], fov: 45 }}>
        <SoftShadows size={20} samples={16} focus={1} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          castShadow 
          position={[10, 20, 10]} 
          intensity={1.5} 
          shadow-mapSize={[2048, 2048]}
        />
        <Environment preset="city" />
        
        <ScrollControls pages={3} damping={0.2}>
          {/* The 3D Scene */}
          <Scroll>
            <ArchitecturalScene />
          </Scroll>
          
          {/* The HTML Overlay */}
          <Scroll html style={{ width: '100%', height: '100%' }}>
            <HtmlContent />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
