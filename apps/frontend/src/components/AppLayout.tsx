import React from 'react';
import { useAppData } from '../contexts/AppContext';
import { useLocation } from 'react-router';

const AppLayout = () => {
  const location = useLocation();

  const { selectedRepoId } = location.state || {};

  const { commitResponse } = useAppData();
  return (
    <div>
      <h1>App Layout</h1>
      <h1>Selected repo:{selectedRepoId}</h1>
      <h1>No of commits :{commitResponse?.length}</h1>
    </div>
  );
};

export default AppLayout;
