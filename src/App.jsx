import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import Navbar from './Components/NavBar';
import HomePage from './Components/HomePage';
import MachineMonitoring from './Components/MachineMonitoring';
import FactoryOverview from './Components/FactoryOverview';

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Layout>
                  <Layout style={{ marginTop: 64 }}>
                    <Content
                      style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 'calc(100vh - 64px)',
                        overflow: 'auto',
                      }}
                    >
                      <Routes>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/machine/:machineId" element={<MachineMonitoring />} />
                        <Route path="*" element={<Navigate to="/home" replace />} />
                        <Route path="/factory-overview" element={<FactoryOverview />} />
                      </Routes>
                    </Content>
                  </Layout>
                </Layout>
              </>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
