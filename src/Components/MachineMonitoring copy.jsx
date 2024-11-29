import React, { useState, ref } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { DatePicker, Select, Card, Statistic } from 'antd';
import ReactApexChart from 'react-apexcharts';

const { RangePicker } = DatePicker;

const MachineMonitoring = () => {
  const { machineId } = useParams();
  const [selectedParameter, setSelectedParameter] = useState('Power Factor');
  
  const parameters = {
    AveragePowerFactor: { value: 5.2, unit: 'kW', color: '#1890ff' },
    PowerFactor1: { value: 5.0, unit: 'kW', color: '#1890ff' },
    PowerFactor2: { value: 5.1, unit: 'kW', color: '#1890ff' },
    PowerFactor3: { value: 5.3, unit: 'kW', color: '#1890ff' },
    TotalCurrent: { value: 12.5, unit: 'A', color: '#52c41a' },
    PhaseCurrentIr: { value: 4.0, unit: 'A', color: '#52c41a' },
    PhaseCurrentIy: { value: 4.2, unit: 'A', color: '#52c41a' },
    PhaseCurrentIb: { value: 4.3, unit: 'A', color: '#52c41a' },
    AveragePhaseVoltage: { value: 42.5, unit: 'kWh', color: '#722ed1' },
    PhaseVoltageIr: { value: 42.0, unit: 'kWh', color: '#722ed1' },
    PhaseVoltageIy: { value: 42.2, unit: 'kWh', color: '#722ed1' },
    PhaseVoltageIb: { value: 42.3, unit: 'kWh', color: '#722ed1' },
    Frequency: { value: 49, unit: 'Hz', color: '#fa8c16' },
  };

  const getChartOption = () => ({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'time' },
    yAxis: { type: 'value' },
    series: [{
      data: [], // Replace with actual data
      type: 'line',
      smooth: true,
    }],
  });

  // Dummy data for the graph
  const dates = [
    { x: new Date('2023-01-01').getTime(), y: 1000000 },
    { x: new Date('2023-01-02').getTime(), y: 1500000 },
    { x: new Date('2023-01-03').getTime(), y: 1200000 },
    { x: new Date('2023-01-04').getTime(), y: 1700000 },
    { x: new Date('2023-01-05').getTime(), y: 1300000 },
  ];

  const series = [{
    name: 'XYZ MOTORS',
    data: dates
  }];

  const options = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    title: {
      text: 'Parameter vs Time',
      align: 'left'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        },
      },
      title: {
        text: 'Value'
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        }
      }
    }
  };

  // Add gauge chart options
  const gaugeOptions = {
    chart: {
      type: 'radialBar',
      height: 350
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontSize: '16px',
            offsetY: -10
          },
          value: {
            show: true,
            fontSize: '30px',
            offsetY: 5
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
  };

  const energyGaugeData = {
    ...gaugeOptions,
    series: [75],
    labels: ['Energy Usage']
  };

  const powerGaugeData = {
    ...gaugeOptions,
    series: [65],
    labels: ['Power Usage']
  };

  return (
   
    <div className="p-2">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Machine {machineId}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white text-black rounded-lg p-0 w-full">
            <h2 className="text-xl font-semibold text-center">Power Factor</h2>
            <div className="text-center mt-4">
              <p className="text-teal-600 text-xl">
                Average Power Factor: <span>{parameters.AveragePowerFactor.value}</span>
              </p>
              <p className="text-blue-600 text-xl">
                Power Factor 1: <span>{parameters.PowerFactor1.value}</span>
              </p>
              <p className="text-blue-600 text-xl">
                Power Factor 2: <span>{parameters.PowerFactor2.value}</span>
              </p>
              <p className="text-blue-600 text-xl">
                Power Factor 3: <span>{parameters.PowerFactor3.value}</span>
              </p>
            </div>
          </Card>

          <Card className="bg-white text-black rounded-lg p-2 w-full">
            <h2 className="text-xl font-bold text-center mb-2">Current</h2>
            <div className="text-center">
              <p className="text-teal-600 text-lg mb-1">
                Total Current: <span className="font-bold">{parameters.TotalCurrent.value}</span>
              </p>
              <p className="text-blue-600 text-xl mb-1">
                Phase Current (Ir): <span className="font-bold">{parameters.PhaseCurrentIr.value}</span>
              </p>
              <p className="text-blue-600 text-xl mb-1">
                Phase Current (Iy): <span className="font-bold">{parameters.PhaseCurrentIy.value}</span>
              </p>
              <p className="text-blue-600 text-xl mb-1">
                Phase Current (Ib): <span className="font-bold">{parameters.PhaseCurrentIb.value}</span>
              </p>
            </div>
          </Card>

          <Card className="bg-white text-black rounded-lg p-2 w-full">
            <h2 className="text-xl font-bold text-center mb-2">Voltage</h2>
            <div className="text-center">
              <p className="text-teal-600 text-lg mb-1">
                Average Phase Voltage: <span className="font-bold">{parameters.AveragePhaseVoltage.value}</span>
              </p>
              <p className="text-blue-600 text-xl mb-1">
                Phase Voltage (Ir): <span className="font-bold">{parameters.PhaseVoltageIr.value}</span>
              </p>
              <p className="text-blue-600 text-xl mb-1">
                Phase Voltage (Iy): <span className="font-bold">{parameters.PhaseVoltageIy.value}</span>
              </p>
              <p className="text-blue-600 text-xl mb-1">
                Phase Voltage (Ib): <span className="font-bold">{parameters.PhaseVoltageIb.value}</span>
              </p>
            </div>
          </Card>

          <Card className="bg-white text-black rounded-lg p-2 w-full">
            <h2 className="text-xl font-bold text-center mb-10">Frequency</h2>
            <div className="text-center">
              <p className="text-teal-600 text-lg mb-1">
                Frequency: <span className="font-bold">{parameters.Frequency.value} {parameters.Frequency.unit}</span>
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex gap-4 mb-6">
          <Select
            value={selectedParameter}
            onChange={setSelectedParameter}
            style={{ width: 200 }}
            options={Object.keys(parameters).map(key => ({
              value: key,
              label: key.charAt(0).toUpperCase() + key.slice(1)
            }))}
          />
          <RangePicker />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Area Chart Card - Takes first 2 columns (Power Factor + Current) */}
          <Card className="col-span-2">
            <ReactApexChart 
              options={options} 
              series={series} 
              type="area" 
              height={350} 
            />
          </Card>

          {/* Energy Gauge Card - Aligns with Voltage card */}
          <Card className="bg-white text-black rounded-lg p-4">
            <h2 className="text-lg font-semibold text-center">Energy Usage</h2>
            <ReactApexChart
              options={energyGaugeData}
              series={energyGaugeData.series}
              type="radialBar"
              height={350}
            />
          </Card>

          {/* Power Gauge Card - Aligns with Frequency card */}
          <Card className="bg-white text-black rounded-lg p-4">
            <h2 className="text-lg font-semibold text-center">Power Usage</h2>
            <ReactApexChart
              options={powerGaugeData}
              series={powerGaugeData.series}
              type="radialBar"
              height={350}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MachineMonitoring;