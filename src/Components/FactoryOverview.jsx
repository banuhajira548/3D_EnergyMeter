import React, { Suspense, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Grid,
  Stats,
  Html,
  Text
} from '@react-three/drei';
import { Machine } from './3DComponents/Machine';
import { Activity, AlertTriangle, ArrowDown, BarChart2, Box } from 'lucide-react';
import * as THREE from 'three';
import { Selection, EffectComposer, Bloom, SelectiveBloom } from '@react-three/postprocessing';

const StatusLegend = () => (
  <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg">
    <h3 className="font-bold mb-2">Machine Status</h3>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
        <span>Running</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
        <span>Idle</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        <span>Stopped/Error</span>
      </div>
    </div>
  </div>
);

const FactoryStats = ({ machines }) => {
  const running = machines.filter(m => m.status === 'running').length;
  const idle = machines.filter(m => m.status === 'idle').length;
  const stopped = machines.filter(m => m.status === 'stopped').length;
  
  return (
    <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-3">Factory Statistics</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Activity className="text-green-500" />
          <span>Running: {running}</span>
        </div>
        <div className="flex items-center gap-4">
          <Activity className="text-yellow-500" />
          <span>Idle: {idle}</span>
        </div>
        <div className="flex items-center gap-4">
          <AlertTriangle className="text-red-500" />
          <span>Stopped: {stopped}</span>
        </div>
      </div>
    </div>
  );
};

const FactoryFloor = ({ machines }) => {
  return (
    <group>
      <Grid 
        args={[50, 50]} 
        cellSize={5}
        cellThickness={1}
        cellColor="#6b7280"
        sectionSize={5}
        fadeDistance={50}
        fadeStrength={1}
      />
      {machines.map((machine) => (
        <Machine
          key={machine.id}
          position={machine.position}
          status={machine.status}
          data={machine}
        />
      ))}
    </group>
  );
};

const FactoryOverview = () => {
  const [viewMode, setViewMode] = useState('3d');
  const [showStats, setShowStats] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState(null);

  // Simplified SMDDC Text Background
  const SMDDCText = () => (
    <group position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <Text
        position={[0, -15, 0.1]}
        scale={[5, 5, 5]}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        fontSize={2}
        font="/src/assets/Heavitas.woff"
        opacity={0.05}
      >
        SMDDC
      </Text>
    </group>
  );

  const machines = [
    {
      id: 'CNC001',
      name: 'CNC Machine 1',
      status: 'running',
      position: [-12, 0, -12],
      currentPower: 5.2,
      temperature: 35,
    },
    {
      id: 'CNC002',
      name: 'CNC Machine 2',
      status: 'idle',
      position: [0, 0, -12],
      currentPower: 3.1,
      temperature: 32,
    },
    {
      id: 'CNC003',
      name: 'CNC Machine 3',
      status: 'stopped',
      position: [12, 0, -12],
      currentPower: 0,
      temperature: 28,
    },
    {
      id: 'CNC004',
      name: 'CNC Machine 4',
      status: 'running',
      position: [-12, 0, 0],
      currentPower: 4.8,
      temperature: 34,
    },
    {
      id: 'CNC005',
      name: 'CNC Machine 5',
      status: 'running',
      position: [0, 0, 0],
      currentPower: 5.5,
      temperature: 36,
    },
    {
      id: 'CNC006',
      name: 'CNC Machine 6',
      status: 'idle',
      position: [12, 0, 0],
      currentPower: 2.1,
      temperature: 30,
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-slate-50 relative">
      <StatusLegend />
      <FactoryStats machines={machines} />
      
      {/* Enhanced Controls */}
      <div className="absolute z-30 bottom-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-xl shadow-lg flex gap-2">
        <button
          onClick={() => setViewMode('3d')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            viewMode === '3d' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Box size={18} />
          3D View
        </button>
        <button
          onClick={() => setViewMode('top')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            viewMode === 'top' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ArrowDown size={18} />
          Top View
        </button>
        <button
          onClick={() => setShowStats(!showStats)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            showStats ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BarChart2 size={18} />
          Stats
        </button>
      </div>

      <Canvas shadows camera={{ 
        position: viewMode === '3d' ? [20, 20, 20] : [0, 30, 0], 
        fov: viewMode === '3d' ? 50 : 35,
        near: 0.1,
        far: 1000
      }}>
        <color attach="background" args={['#f8fafc']} />
        
        <OrbitControls 
          maxPolarAngle={viewMode === '3d' ? Math.PI / 2.1 : Math.PI / 2}
          minDistance={10}
          maxDistance={100}
          enableDamping
          dampingFactor={0.05}
          target={[0, 0, 0]}
          enabled={true}
        />

        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        <Suspense fallback={null}>
          <SMDDCText />
          <FactoryFloor machines={machines} />
          <Environment preset="warehouse" />
          {showStats && <Stats />}
          
          {/* Enhanced Grid */}
          <gridHelper 
            args={[100, 100, '#94a3b8', '#cbd5e1']}
            position={[0, 0.02, 0]}
          />

          {/* Enhanced Compass */}
          <group position={[-45, 0.1, -45]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.5, 0.1, 0.1]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.1, 1.5]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
            <Html position={[1, 0, 0]}>
              <div className="text-red-500 font-bold">N</div>
            </Html>
            <Html position={[0, 0, 1]}>
              <div className="text-blue-500 font-bold">E</div>
            </Html>
          </group>
        </Suspense>

        {/* <EffectComposer>
          <SelectiveBloom 
            intensity={0.5}
            // luminanceThreshold={0.1}
            luminanceSmoothing={0.2}
          />
          <Bloom 
            intensity={0.1}
            // luminanceThreshold={0.1}
            luminanceSmoothing={0.2}
          />
        </EffectComposer> */}
      </Canvas>
    </div>
  );
};

export default FactoryOverview;