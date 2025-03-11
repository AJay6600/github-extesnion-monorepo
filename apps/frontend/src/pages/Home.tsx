import { Col, Row, Timeline } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import GetRepoForm from '../forms/GetRepoForm';

const Home = () => {
  /** Function to fetch the current active tab's URL */
  const fetchActiveTabUrl = () => {
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        /** only set the url when user is on Apollo's task page for the particular sequence */
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('github')) {
          console.log('Tab Url:', tabs[0].url);
        }
      }
    );
  };

  return (
    <Row justify="center" align="middle" className="h-[100vh]">
      <Col>
        <GetRepoForm />
      </Col>
    </Row>
  );
};

export default Home;
