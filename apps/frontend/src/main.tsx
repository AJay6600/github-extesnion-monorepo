import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import antdTheme from './utils/antd/antd-theme';
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ConfigProvider theme={antdTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
