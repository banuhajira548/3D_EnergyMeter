import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, PlusCircleOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/home'),
    },
    {
      key: 'addMachine',
      icon: <PlusCircleOutlined />,
      label: 'Add Machine',
      onClick: () => navigate('/add-machine'),
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
        key: 'factoryOverview',
        // icon: <LayoutOutlined />,
        label: 'Factory Overview',
        onClick: () => navigate('/factory-overview'),
      },
  ];

  return (
    <Header
      style={{
        position: 'fixed',
        width: '100%',
        zIndex: 1,
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold' }}>
        Energy Monitor
      </div>
      <Menu mode="horizontal" items={menuItems} style={{ border: 'none' }} />
    </Header>
  );
};

export default Navbar; 