import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DatePicker, Select, Card, Badge, Progress } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { 
  Zap, 
  Battery, 
  Gauge, 
  ThermometerSun, 
  Clock, 
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Activity,
  Power,
  Wifi,
  Settings,
  Calendar,
  BarChart3
} from 'lucide-react';

const { RangePicker } = DatePicker;

const MachineMonitoring = () => {
  const { machineId } = useParams();
  const [selectedParameter, setSelectedParameter] = useState('Power Factor');
  const [timeRange, setTimeRange] = useState('day');
  const [isOnline, setIsOnline] = useState(true);
  
  const parameters = {
    AveragePowerFactor: { value: 5.2, unit: 'kW', color: '#1890ff', trend: 'up', change: '+2.3%' },
    PowerFactor1: { value: 5.0, unit: 'kW', color: '#1890ff', trend: 'up', change: '+1.8%' },
    PowerFactor2: { value: 5.1, unit: 'kW', color: '#1890ff', trend: 'down', change: '-0.5%' },
    PowerFactor3: { value: 5.3, unit: 'kW', color: '#1890ff', trend: 'up', change: '+3.1%' },
    TotalCurrent: { value: 12.5, unit: 'A', color: '#52c41a', trend: 'up', change: '+1.2%' },
    PhaseCurrentIr: { value: 4.0, unit: 'A', color: '#52c41a', trend: 'down', change: '-0.8%' },
    PhaseCurrentIy: { value: 4.2, unit: 'A', color: '#52c41a', trend: 'up', change: '+2.1%' },
    PhaseCurrentIb: { value: 4.3, unit: 'A', color: '#52c41a', trend: 'up', change: '+1.5%' },
    AveragePhaseVoltage: { value: 42.5, unit: 'V', color: '#722ed1', trend: 'up', change: '+0.7%' },
    PhaseVoltageIr: { value: 42.0, unit: 'V', color: '#722ed1', trend: 'down', change: '-0.3%' },
    PhaseVoltageIy: { value: 42.2, unit: 'V', color: '#722ed1', trend: 'up', change: '+1.1%' },
    PhaseVoltageIb: { value: 42.3, unit: 'V', color: '#722ed1', trend: 'up', change: '+0.9%' },
    Frequency: { value: 49, unit: 'Hz', color: '#fa8c16', trend: 'stable', change: '0%' },
    Temperature: { value: 45, unit: '°C', color: '#f5222d', trend: 'up', change: '+2.1%' },
    Efficiency: { value: 92, unit: '%', color: '#13c2c2', trend: 'up', change: '+1.5%' },
  };

  // Machine status card data
  const statusData = {
    uptime: '23h 45m',
    efficiency: 92,
    temperature: 45,
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-03-15',
    alerts: 2,
  };

  // Enhanced time series data
  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      data.push({
        x: new Date(now - i * 3600000),
        y: Math.floor(Math.random() * (100 - 50) + 50)
      });
    }
    return data.reverse();
  };

  const series = [{
    name: selectedParameter,
    data: generateTimeSeriesData()
  }];

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      title: {
        text: `${selectedParameter} (${parameters[selectedParameter]?.unit || ''})`
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'HH:mm'
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Machine Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            Machine {machineId}
          </h1>
          <p className="text-gray-500 mt-1">CNC Milling Machine</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge 
            status={isOnline ? "success" : "error"} 
            text={isOnline ? "Online" : "Offline"} 
          />
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
            options={[
              { value: 'hour', label: 'Last Hour' },
              { value: 'day', label: 'Last Day' },
              { value: 'week', label: 'Last Week' },
              { value: 'month', label: 'Last Month' }
            ]}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          title="Uptime"
          value={statusData.uptime}
          subtitle="Total Running Time"
        />
        <QuickStatCard
          icon={<Gauge className="h-6 w-6 text-green-600" />}
          title="Efficiency"
          value={`${statusData.efficiency}%`}
          subtitle="Overall Equipment Effectiveness"
        />
        <QuickStatCard
          icon={<ThermometerSun className="h-6 w-6 text-red-600" />}
          title="Temperature"
          value={`${statusData.temperature}°C`}
          subtitle="Current Operating Temperature"
        />
        <QuickStatCard
          icon={<AlertTriangle className="h-6 w-6 text-yellow-600" />}
          title="Alerts"
          value={statusData.alerts}
          subtitle="Active Warnings"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Parameters Section */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-full shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Performance Metrics</h2>
              <RangePicker className="w-64" />
            </div>
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="area"
              height={400}
            />
          </Card>
        </div>

        {/* Status Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Machine Status</h3>
            <div className="space-y-4">
              <StatusItem
                icon={<Activity className="h-5 w-5 text-blue-600" />}
                label="Current Load"
                value="78%"
              />
              <StatusItem
                icon={<Power className="h-5 w-5 text-green-600" />}
                label="Power Consumption"
                value="5.2 kW"
              />
              <StatusItem
                icon={<Calendar className="h-5 w-5 text-purple-600" />}
                label="Next Maintenance"
                value={statusData.nextMaintenance}
              />
              <StatusItem
                icon={<BarChart3 className="h-5 w-5 text-orange-600" />}
                label="Production Rate"
                value="92 units/hr"
              />
            </div>
          </Card>

          <Card className="shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Energy Efficiency</h3>
            <div className="text-center">
              <Progress
                type="dashboard"
                percent={75}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                width={180}
              />
              <p className="mt-4 text-gray-600">Current Energy Score</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const QuickStatCard = ({ icon, title, value, subtitle }) => (
  <Card className="shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  </Card>
);

const StatusItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-gray-600">{label}</span>
    </div>
    <span className="font-semibold">{value}</span>
  </div>
);

export default MachineMonitoring;