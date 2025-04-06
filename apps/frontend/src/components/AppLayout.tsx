import { Col, Layout, Row, Typography } from 'antd';
import { Outlet, useLocation } from 'react-router';
import HomePageHeader from './HomePageHeader';

const { Header, Content } = Layout;

const { Text } = Typography;

const AppLayout = () => {
  const location = useLocation();

  /** Returns the header component for the application based on the current route. */
  const getHeaderComponent = () => {
    /** Header for index route */
    if (location.pathname === '/') {
      return (
        <Row justify="center" align="middle" className="h-[80%]">
          <Col>
            <Text className="text-xl font-bold text-secondary">
              Select Repository
            </Text>
          </Col>
        </Row>
      );
    }

    if (location.pathname === '/home') {
      return <HomePageHeader />;
    }
  };

  return (
    <Layout className="h-[100vh] bg-primary-100">
      {/* header */}
      <Header className="min-h-[15%] bg-gradient-to-r from-primary-100 to-primary p-0">
        {getHeaderComponent()}
      </Header>

      {/* Content */}
      <Content className="h-[85%] flex justify-center align-middle bg-white rounded-t-[25px] shadow-[0px_-1px_2px_0px_white] -mt-4 z-10 relative">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
