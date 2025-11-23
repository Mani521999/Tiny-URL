import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LinkStats from './pages/LinkStats';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/code/:code" element={<LinkStats />} />
      </Routes>
    </Layout>
  );
}

export default App;
