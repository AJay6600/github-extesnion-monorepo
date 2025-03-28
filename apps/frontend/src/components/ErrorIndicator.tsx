import { Row } from 'antd';

/** type for ErrorMessage component props */
export type ErrorMessagePropsType = {
  error: Error | chrome.runtime.LastError;
};

const ErrorIndicator = ({ error }: ErrorMessagePropsType) => {
  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <span
        style={{
          color: 'var(--color-error)',
          textAlign: 'center',
          padding: '0px 12px',
        }}
      >
        {error.message}
      </span>
    </Row>
  );
};

export default ErrorIndicator;
