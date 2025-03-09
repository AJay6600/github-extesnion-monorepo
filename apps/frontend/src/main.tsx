import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import antdTheme from './utils/antd/antd-theme';
import { ConfigProvider } from 'antd';
import { HashRouter } from 'react-router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ConfigProvider theme={antdTheme}>
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </StrictMode>
);
