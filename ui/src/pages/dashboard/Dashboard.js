import React, { useEffect } from 'react';

const Dashboard = () => {
  useEffect(() => {
    document.title = `Dashboard | ${process.env.REACT_APP_NAME}`;
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
