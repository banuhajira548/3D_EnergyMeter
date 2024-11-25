import React, { useState,ref } from 'react';
import { useParams } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { DatePicker, Select, Card, Statistic } from 'antd';

const { RangePicker } = DatePicker;

const MachineMonitoring = () => {
  const { machineId } = useParams();
  const [selectedParameter, setSelectedParameter] = useState('power');
  
  const parameters = {
    power: { value: 5.2, unit: 'kW', color: '#1890ff' },
    current: { value: 12.5, unit: 'A', color: '#52c41a' },
    energy: { value: 42.5, unit: 'kWh', color: '#722ed1' },
    frequency: { value: 50, unit: 'Hz', color: '#fa8c16' },
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Machine {machineId}</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(parameters).map(([key, data]) => (
            <Card key={key}>
              <Statistic
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                value={data.value}
                suffix={data.unit}
                valueStyle={{ color: data.color }}
              />
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
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

        <ReactECharts option={getChartOption()} style={{ height: '400px' }} />
      </div>
    </div>
  );
};

export default MachineMonitoring;