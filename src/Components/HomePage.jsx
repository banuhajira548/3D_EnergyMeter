import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Power, Battery, Clock, Search, 
  Filter, LayoutGrid, LayoutList, AlertTriangle,
  Activity, Zap, Timer, Thermometer, 
  BatteryCharging, Gauge, TrendingUp, 
  BarChart2, Cpu, Wrench, AlertCircle,
  DollarSign, Waves
} from 'lucide-react';
import { Card, Tag, Progress, Tooltip, Badge } from 'antd';

const MachineCard = ({ machine, viewMode }) => {
  const navigate = useNavigate();

  const getHealthColor = (health) => {
    if (health >= 90) return 'green';
    if (health >= 70) return 'orange';
    return 'red';
  };

  const StatusIndicator = ({ status, health }) => (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${
        status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      <span className={`text-sm ${
        status === 'active' ? 'text-green-700' : 'text-red-700'
      }`}>
        {status === 'active' ? 'Running' : 'Stopped'}
      </span>
      <Tooltip title="Machine Health">
        <Tag color={getHealthColor(health)}>{health}% Health</Tag>
      </Tooltip>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <Card 
        hoverable
        onClick={() => navigate(`/machine/${machine.id}`)}
        className="cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20">
            <img 
              src={machine.image} 
              alt={machine.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{machine.name}</h3>
                <p className="text-sm text-gray-500">ID: {machine.id}</p>
                <StatusIndicator status={machine.status} health={machine.health || 95} />
              </div>
              
              <div className="flex gap-8">
                <MetricDisplay 
                  icon={<Zap className="text-blue-500" size={18} />}
                  value={machine.Power}
                  unit="kW"
                  label="Current Power"
                />
                <MetricDisplay 
                  icon={<Battery className="text-purple-500" size={18} />}
                  value={machine.energyToday}
                  unit="kWh"
                  label="Energy Today"
                />
                <MetricDisplay 
                  icon={<Gauge className="text-orange-500" size={18} />}
                  value={machine.efficiency || 92}
                  unit="%"
                  label="Efficiency"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      hoverable
      onClick={() => navigate(`/machine/${machine.id}`)}
      className="h-full cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img 
          src={machine.image} 
          alt={machine.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="absolute top-2 right-2">
          <StatusIndicator status={machine.status} health={machine.health || 95} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{machine.name}</h3>
            <p className="text-sm text-gray-500">ID: {machine.id}</p>
          </div>
          <Settings className="text-gray-400 hover:text-gray-600" size={20} />
        </div>

        {/* <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={<Zap size={20} />}
            value={machine.Power}
            unit="kW"
            label="Power"
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <MetricCard
            icon={<Battery size={20} />}
            value={machine.energyToday}
            unit="kWh"
            label="Energy"
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
        </div> */}

        {/* <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={<DollarSign size={20} />}
            value={machine.costPerHour || "12.5"}
            unit="$/hr"
            label="Operating Cost"
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <MetricCard
            icon={<Waves size={20} />}
            value={machine.powerFactor || "0.95"}
            unit="PF"
            label="Power Quality"
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
        </div> */}

        <div className="pt-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Efficiency</span>
            <span>{machine.efficiency || 92}%</span>
          </div>
          <Progress 
            percent={machine.efficiency || 92} 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            showInfo={false}
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <Tag 
            icon={<TrendingUp size={14} />}
            color="blue"
          >
            {machine.energyTrend || "+2.3%"} Today
          </Tag>
          <Tag 
            icon={<Wrench size={14} />}
            color={machine.maintenanceStatus === 'due' ? 'warning' : 'success'}
          >
            {machine.maintenanceStatus === 'due' ? 'Maintenance Due' : 'Healthy'}
          </Tag>
        </div>
      </div>
    </Card>
  );
};

const MetricDisplay = ({ icon, value, unit, label }) => (
  <div className="text-center">
    <div className="flex items-center gap-1">
      {icon}
      <span className="font-semibold">{value} {unit}</span>
    </div>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const MetricCard = ({ icon, value, unit, label, bgColor, textColor }) => (
  <div className={`${bgColor} p-3 rounded-lg`}>
    <div className={`flex items-center gap-2 ${textColor} mb-1`}>
      {icon}
      <span className="font-semibold">{value} {unit}</span>
    </div>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const HomePage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced mock data
  const machines = [
    {
      id: 'CNC001',
      name: 'Mazak H 100',
      status: 'active',
      Power: 5.2,
      energyToday: 42.5,
      costPerHour: 12.5,
      powerFactor: 0.95,
      energyTrend: '+2.3%',
      image: '/src/assets/machine_1.png'
    },
    {
        id: 'CNC002',
        name: 'HMT Stallion 200',
        status: 'active',
        Power: 5.2,
        energyToday: 42.5,
        image: '/src/assets/machine_2.png'
      },
      {
        id: 'CNC003',
        name: 'HMT VTC 800',
        status: 'active',
        Power: 5.2,
        energyToday: 42.5,
        image: '/src/assets/machine_3.png'

      },
      {
        id: 'CNC004',
        name: 'Schaublin',
        status: 'active',
        Power: 5.2,
        energyToday: 42.5,
      image: '/src/assets/machine_3.png'

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
    <div className="mx-auto px-4 py-2">
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Machine Overview</h1>
            <p className="text-gray-500 text-sm">Monitor and manage your CNC machines</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-3"
            }>
              {filteredMachines.map(machine => (
                <div className="mb-4">
                  <MachineCard key={machine.id} machine={machine} viewMode={viewMode} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;