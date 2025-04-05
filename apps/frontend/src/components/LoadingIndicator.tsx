import { Row, Spin } from 'antd';

const LoadingIndicator = () => {
  return (
    <Row justify="center" align="middle">
      <Spin size="large" />
    </Row>
  );
};

export default LoadingIndicator;
