import React, { useRef, useState } from 'react';
import { Html, Outlines } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { Selection, Select } from '@react-three/postprocessing';

const MachineTooltip = ({ data }) => (
  <div className="bg-white/90 p-3 rounded-lg shadow-lg min-w-[200px]">
    <h3 className="font-bold text-lg">{data.name}</h3>
    <div className="space-y-1 mt-2">
      <div className="flex justify-between">
        <span>Power:</span>
        <span>{data.Power} kW</span>
      </div>
      <div className="flex justify-between">
        <span>Energy:</span>
        <span>{data.Energy}kWh</span>
      </div>
      <div className="flex justify-between">
        <span>Status:</span>
        <span className={`font-semibold ${
          data.status === 'running' ? 'text-green-600' : 
          data.status === 'idle' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
      </div>
    </div>
  </div>
);

export const Machine = ({ position, status, data }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const statusColors = {
    running: '#22c55e',
    idle: '#eab308',
    stopped: '#ef4444',
  };

  const glowIntensity = status === 'running' ? 1.5 : 1;
  
  const obj = useLoader(OBJLoader, '/src/assets/doosan v1.obj');
  const adjustedPosition = [position[0], position[1] + 2, position[2]]; // Raised higher

  useFrame(() => {
    if (status === 'running' && meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const model = obj.clone();
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: statusColors[status],
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: statusColors[status],
        emissiveIntensity: glowIntensity,
        transparent: true,
        opacity: 0.95,
      });
      // Add edge geometry for better visibility
      const edges = new THREE.EdgesGeometry(child.geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ 
          color: statusColors[status],
          linewidth: 1.5,
          opacity: 1.5,
          transparent: true 
        })
      );
      child.add(line);
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group position={adjustedPosition}>
      <Selection>
        <Select enabled={hovered}>
          <primitive 
            ref={meshRef}
            object={model}
            scale={[0.02, 0.02, 0.02]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => navigate(`/machine/${data.id}`)}
          >
            <Outlines 
              thickness={0.05} // Increased thickness
              color={hovered ? "#ffffff" : statusColors[status]}
              transparent
              opacity={0.7} // Increased opacity
            />
          </primitive>
        </Select>
      </Selection>

      {/* Base platform for each machine */}
      <mesh position={[0, -1.8, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial 
          color={statusColors[status]} 
          opacity={0.1} 
          transparent 
          roughness={0.9}
        />
      </mesh>

      {/* Status indicator light */}
      {status === 'running' && (
        <pointLight
          position={[0, 0, 0]}
          distance={3}
          intensity={0.5}
          color={statusColors[status]}
        />
      )}

      {/* Hover tooltip */}
      {hovered && (
        <Html distanceFactor={20} position={[0, 3, 0]}>
          <div className="bg-white/95 p-4 rounded-xl shadow-lg min-w-[250px] border border-gray-200">
            <h3 className="font-bold text-lg mb-2">{data.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Power:</span>
                <span className="font-medium">{data.Power} kW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Energy:</span>
                <span className="font-medium">{data.Energy}kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold px-2 py-1 rounded-full text-sm ${
                  data.status === 'running' ? 'bg-green-100 text-green-700' : 
                  data.status === 'idle' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};