import React from 'react';
import { Layout, Menu } from 'antd';
// import { 
//   MachineOutlined, 
//   BarChartOutlined, 
//   SettingOutlined,
//   UserOutlined 
// } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
//   const userRole = localStorage.getItem('userRole');

  const menuItems = [
    {
      key: 'dashboard',
    //   icon: <MachineOutlined />,
      label: 'Machine 1',
      onClick: () => navigate(`/dashboard`),
    },
    {
      key: 'analytics',
    //   icon: <BarChartOutlined />,
      label: 'Machine 2',
      onClick: () => navigate(`/analytics`),
    },
    {
      key: 'profile',
    //   icon: <UserOutlined />,
      label: 'Machine 3',
      onClick: () => navigate(`/profile`),
    },
    {
      key: 'settings',
    //   icon: <SettingOutlined />,
      label: 'Machine 4',
      onClick: () => navigate(`/settings`),
    },
  ];

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        background: '#fff',
      }}
      width={200}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar; 