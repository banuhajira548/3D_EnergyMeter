import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DatePicker, Select, Card, Badge, Progress, Button, Modal, Tooltip, Switch, Table, Tag } from 'antd';
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
  BarChart3,
  BatteryCharging,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  History,
  Download,
  PieChart,
  Maximize2,
  BellRing,
  FileBarChart,
  Cpu,
  Wrench,
  
  InfoIcon
} from 'lucide-react';

const { RangePicker } = DatePicker;

const alertHistoryColumns = [
  {
    title: 'Time',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
    render: (severity) => (
      <Tag color={getSeverityColor(severity)}>{severity.toUpperCase()}</Tag>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'resolved' ? 'green' : 'orange'}>{status}</Tag>
    ),
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
];

const getMaintenanceStatusColor = (health) => {
  if (health >= 90) return 'green';
  if (health >= 70) return 'orange';
  if (health >= 50) return 'yellow';
  return 'red';
};

const getSeverityColor = (severity) => {
  const colors = {
    low: 'blue',
    medium: 'orange',
    high: 'red',
    critical: 'purple'
  };
  return colors[severity.toLowerCase()] || 'blue';
};

const MaintenanceRecommendations = ({ recommendations }) => (
  <div className="space-y-4">
    {recommendations.map((rec, index) => (
      <div key={index} className="p-4 border rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{rec.component}</h4>
            <p className="text-gray-600 text-sm">{rec.action}</p>
          </div>
          <Tag color={getSeverityColor(rec.urgency)}>{rec.urgency}</Tag>
        </div>
      </div>
    ))}
  </div>
);

const MachineMonitoring = () => {
  const { machineId } = useParams();
  const [selectedParameter, setSelectedParameter] = useState('Power Factor');
  const [timeRange, setTimeRange] = useState('day');
  const [isOnline, setIsOnline] = useState(true);
  const [showEnergyBreakdown, setShowEnergyBreakdown] = useState(false);
  const [showAlertHistory, setShowAlertHistory] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [predictiveMaintenance, setPredictiveMaintenance] = useState(null);
  
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
    try {
      const data = [];
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        data.push({
          x: new Date(now - i * 3600000),
          y: Math.floor(Math.random() * (100 - 50) + 50)
        });
      }
      return data.reverse();
    } catch (error) {
      console.error('Error generating time series data:', error);
      return [];
    }
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

  // Energy consumption breakdown
  const energyBreakdown = {
    standby: 15,
    operational: 65,
    peak: 20,
    totalConsumption: 450, // kWh
    costPerHour: 12.5, // $/hour
    savings: 8.2, // % compared to last period
  };

  // Predictive maintenance data
  const maintenancePredictor = {
    nextPredictedIssue: '2024-04-01',
    componentHealth: {
      motor: 92,
      bearings: 87,
      coolantSystem: 95,
      hydraulics: 89,
    },
    recommendations: [
      { component: 'Bearings', action: 'Inspection needed', urgency: 'medium' },
      { component: 'Hydraulics', action: 'Oil change recommended', urgency: 'low' },
    ],
  };

  // Alert history
  const alertHistory = [
    {
      id: 1,
      timestamp: '2024-03-15 14:30',
      type: 'Power Surge',
      severity: 'high',
      status: 'resolved',
      duration: '5m',
    },
    // ... more alerts ...
  ];

  // Energy efficiency recommendations
  const efficiencyTips = [
    {
      title: 'Optimize Standby Time',
      potential: '15% reduction',
      impact: 'high',
      description: 'Reduce machine idle time during shift changes',
    },
    // ... more tips ...
  ];

  // New section for real-time power quality metrics
  const powerQualityMetrics = {
    harmonicDistortion: 2.3,
    powerFactor: 0.95,
    voltageImbalance: 1.2,
    frequency: 50.0,
  };

  // Energy cost calculator
  const calculateEnergyCost = (consumption, rate) => {
    return (consumption * rate).toFixed(2);
  };

  // Add error handling for data
  const safeMaintenancePredictor = {
    nextPredictedIssue: '2024-04-01',
    componentHealth: maintenancePredictor?.componentHealth || {},
    recommendations: maintenancePredictor?.recommendations || [],
    overallHealth: maintenancePredictor?.overallHealth || 0,
  };

  // Add error handling for undefined parameters
  const getParameterValue = (paramKey) => {
    return parameters[paramKey]?.value || 0;
  };

  // Add error boundary for chart rendering
  const renderChart = () => {
    try {
      return (
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={400}
        />
      );
    } catch (error) {
      console.error('Error rendering chart:', error);
      return <div className="text-red-500">Error loading chart</div>;
    }
  };

  // Add loading states
  const [isLoading, setIsLoading] = useState(false);

  // Add error state
  const [error, setError] = useState(null);

  // Add cleanup on unmount
  useEffect(() => {
    let mounted = true;

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  // Add error handling for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Your data fetching logic here
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [machineId]);

  return (
    <div className="p-4 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
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
              icon={<BatteryCharging className="h-6 w-6 text-purple-600" />}
              title="Energy Cost"
              value={`$${calculateEnergyCost(energyBreakdown.totalConsumption, 0.12)}`}
              subtitle="Today's Consumption Cost"
            />
            <QuickStatCard
              icon={<Zap className="h-6 w-6 text-orange-600" />}
              title="Power Quality"
              value={`${powerQualityMetrics.powerFactor}`}
              subtitle="Power Factor"
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
                {renderChart()}
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

          {/* Alert History Modal */}
          <Modal
            title="Alert History"
            visible={showAlertHistory}
            onCancel={() => setShowAlertHistory(false)}
            width={800}
            footer={null}
          >
            <Table
              dataSource={alertHistory}
              columns={alertHistoryColumns}
              pagination={{ pageSize: 5 }}
            />
          </Modal>
        </>
      )}
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

const PowerQualityCard = ({ title, value, status }) => (
  <div className={`p-4 rounded-lg border ${
    status === 'good' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
  }`}>
    <h4 className="text-sm text-gray-600">{title}</h4>
    <p className="text-xl font-bold mt-1">{value}</p>
    <div className={`text-sm ${
      status === 'good' ? 'text-green-600' : 'text-yellow-600'
    }`}>
      {status === 'good' ? 'Normal Range' : 'Monitor'}
    </div>
  </div>
);

const CostAnalysisCard = ({ period, consumption, cost, trend }) => (
  <div className="p-4 rounded-lg border border-gray-200">
    <h4 className="text-sm text-gray-600">{period} Consumption</h4>
    <p className="text-xl font-bold mt-1">{consumption} kWh</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-gray-500">${cost}</span>
      <span className={`text-sm ${
        trend.startsWith('+') ? 'text-red-500' : 'text-green-500'
      }`}>
        {trend}
      </span>
    </div>
  </div>
);

const ComponentHealthCard = ({ components }) => (
  <div className="space-y-4">
    {Object.entries(components).map(([component, health]) => (
      <div key={component} className="flex items-center justify-between">
        <span className="text-gray-600">{component}</span>
        <Progress
          percent={health}
          size="small"
          strokeColor={getHealthColor(health)}
        />
      </div>
    ))}
  </div>
);

const EfficiencyTipCard = ({ tip }) => (
  <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold">{tip.title}</h4>
        <p className="text-gray-600 text-sm mt-1">{tip.description}</p>
      </div>
      <Tag color={getImpactColor(tip.impact)}>{tip.potential}</Tag>
    </div>
  </div>
);

// Helper functions
const getHealthColor = (health) => {
  if (health >= 90) return '#52c41a';
  if (health >= 70) return '#faad14';
  return '#f5222d';
};

const getImpactColor = (impact) => {
  const colors = {
    high: 'green',
    medium: 'blue',
    low: 'orange',
  };
  return colors[impact] || 'blue';
};

export default MachineMonitoring;