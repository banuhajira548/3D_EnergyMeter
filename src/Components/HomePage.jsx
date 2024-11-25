import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Power, Battery, Clock, Search, 
  Filter, LayoutGrid, LayoutList, AlertTriangle,
  Activity, Zap, Timer, ThermometerSun
} from 'lucide-react';

const MachineCard = ({ machine, viewMode }) => {
  const navigate = useNavigate();

  const StatusIndicator = ({ status }) => (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${
        status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      <span className={`text-sm ${
        status === 'active' ? 'text-green-700' : 'text-red-700'
      }`}>
        {status === 'active' ? 'Running' : 'Stopped'}
      </span>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => navigate(`/machine/${machine.id}`)}
        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center gap-4"
      >
        <div className="w-16 h-16 relative">
          <img 
            src={machine.image} 
            alt={machine.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute -top-2 -right-2">
            <StatusIndicator status={machine.status} />
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800">{machine.name}</h3>
          <p className="text-sm text-gray-500">ID: {machine.id}</p>
        </div>

        <div className="flex gap-8 items-center">
          <div className="text-center">
            <div className="flex items-center gap-2 text-blue-600">
              <Zap size={16} />
              <span className="font-semibold">{machine.currentPower} kW</span>
            </div>
            <p className="text-xs text-gray-500">Current Power</p>
          </div>

          <div className="text-center">
            <div className="flex items-center gap-2 text-purple-600">
              <Battery size={16} />
              <span className="font-semibold">{machine.energyToday} kWh</span>
            </div>
            <p className="text-xs text-gray-500">Energy Today</p>
          </div>

          <div className="text-center">
            <div className="flex items-center gap-2 text-orange-600">
              <ThermometerSun size={16} />
              <span className="font-semibold">{machine.temperature}°C</span>
            </div>
            <p className="text-xs text-gray-500">Temperature</p>
          </div>
        </div>

        <div className="text-right">
          <Clock size={14} className="inline mr-1" />
          <span className="text-sm text-gray-500">{machine.lastUpdated}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => navigate(`/machine/${machine.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative h-48">
        <img 
          src={machine.image} 
          alt={machine.name}
          className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
        <div className="absolute top-2 right-2">
          <StatusIndicator status={machine.status} />
        </div>
        {machine.alerts > 0 && (
          <div className="absolute bottom-2 left-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <AlertTriangle size={14} />
            {machine.alerts} Alerts
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{machine.name}</h3>
            <p className="text-sm text-gray-500">ID: {machine.id}</p>
          </div>
          <Settings size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Power size={16} />
              <span className="font-semibold">{machine.currentPower} kW</span>
            </div>
            <p className="text-xs text-gray-500">Current Power</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Activity size={16} />
              <span className="font-semibold">{machine.energyToday} kWh</span>
            </div>
            <p className="text-xs text-gray-500">Energy Today</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Timer size={14} />
            <span>Runtime: {machine.runtime}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{machine.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced mock data
  const machines = [
    {
      id: 'CNC001',
      name: 'CNC Machine 1',
      status: 'active',
      currentPower: 5.2,
      energyToday: 42.5,
      temperature: 35,
      runtime: 18.5,
      lastUpdated: '2 min ago',
      alerts: 2,
      image: '/src/assets/machine_1.png'
    },
    {
        id: 'CNC001',
        name: 'CNC Machine 1',
        status: 'active',
        currentPower: 5.2,
        energyToday: 42.5,
        temperature: 35,
        runtime: 18.5,
        lastUpdated: '2 min ago',
        alerts: 2,
        image: 'https://images.unsplash.com/photo-1565434299055-1d0c0b7ce338?ixlib=rb-4.0.3'
      },
      {
        id: 'CNC001',
        name: 'CNC Machine 1',
        status: 'active',
        currentPower: 5.2,
        energyToday: 42.5,
        temperature: 35,
        runtime: 18.5,
        lastUpdated: '2 min ago',
        alerts: 2,
        image: 'https://images.unsplash.com/photo-1565434299055-1d0c0b7ce338?ixlib=rb-4.0.3'
      },
      {
        id: 'CNC001',
        name: 'CNC Machine 1',
        status: 'active',
        currentPower: 5.2,
        energyToday: 42.5,
        temperature: 35,
        runtime: 18.5,
        lastUpdated: '2 min ago',
        alerts: 2,
        image: 'https://images.unsplash.com/photo-1565434299055-1d0c0b7ce338?ixlib=rb-4.0.3'
      },
    // Add more machines with similar data structure
  ];

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         machine.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || machine.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Machine Overview</h1>
            <p className="text-gray-500 mt-1">Monitor and manage your CNC machines</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="search" 
                placeholder="Search machines..." 
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <LayoutList size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Machines</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredMachines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No machines found matching your criteria
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
            }>
              {filteredMachines.map(machine => (
                <MachineCard key={machine.id} machine={machine} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;