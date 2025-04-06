import {
  Button,
  Col,
  Dropdown,
  MenuProps,
  message,
  Modal,
  Row,
  Typography,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useAppData } from '../contexts/AppContext';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { RxCountdownTimer } from 'react-icons/rx';
import { FaCode } from 'react-icons/fa6';
import axios from 'axios';
import { getSessionStorageItem } from '../utils/helpers/getSessionFunc';
import { logger } from '../utils/helpers/logger';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const { Text } = Typography;

const HomePageHeader = () => {
  const navigate = useNavigate();

  const {
    repoResponse,
    selectedRepo,
    commitResponse,
    setSelectedRepo,
    setCommitResponse,
    setRepoResponse,
  } = useAppData();

  /** This state will handle the opening of modal */
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /** This state will store the message for the modal */
  const [modalMessage, setModalMessage] = useState<string>();

  /** Items for the drop down */
  const items: MenuProps['items'] =
    repoResponse && Array.isArray(repoResponse) && repoResponse.length > 0
      ? repoResponse.map((repo) => ({
          key: repo.id,
          label: repo.name,
        }))
      : [];

  return (
    <>
      <Modal
        open={isModalOpen}
        closable={false}
        centered
        footer={
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Ok
          </Button>
        }
      >
        {modalMessage}
      </Modal>

      <Row justify="center" align="middle" className="flex h-[80%] mt-2">
        <Col span={24} className="flex justify-center">
          <Dropdown
            menu={{
              items,
              selectable: true,
              className: 'overflow-scroll h-full w-full',
              defaultSelectedKeys: [selectedRepo?.id.toString() as string],
              onSelect: async ({ selectedKeys }) => {
                const selectedRepo = repoResponse
                  ? repoResponse.filter(
                      (repo) => repo.id.toString() === selectedKeys[0]
                    )
                  : [];

                try {
                  /** Response data */
                  const { data } = await axios.post(
                    `${import.meta.env.VITE_BACKEND_ENDPOINT}/user/commits`,
                    {
                      repoLink: selectedRepo && selectedRepo[0].apiUrl,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${await getSessionStorageItem(
                          'token'
                        )}`,
                      },
                    }
                  );

                  /**
                   * if the commit data is preset , update the commitRepoResponse context
                   * if there is not commits, show the no commit found modal and reset the form
                   */
                  if (data && Array.isArray(data) && data.length > 0) {
                    /** Update the commit response context */
                    setCommitResponse(data);
                    /** Update the selected repo id */
                    setSelectedRepo(selectedRepo[0]);
                  } else if (data['message'] === 'No commit found') {
                    setModalMessage(
                      `The ${selectedRepo[0].name} has no commits`
                    );
                    setIsModalOpen(true);
                  }
                } catch (error) {
                  const err = error as Error;

                  /**
                   * If the error is showing git Repository is empty then show the message
                   * it is not logical error
                   */
                  if (
                    axios.isAxiosError(error) &&
                    error.response &&
                    error.response.data &&
                    error.response.data['message'] ===
                      'Git Repository is empty.'
                  ) {
                    setModalMessage(
                      `Git Repository ${selectedRepo[0].name} is empty.`
                    );
                    setIsModalOpen(true);
                  } else {
                    logger(err);
                    message.error(err.message);
                  }
                }
              },
            }}
            autoAdjustOverflow={true}
            trigger={['click']}
            rootClassName="h-[50vh] w-[95vw]"
            placement="topCenter"
          >
            <span className="inline-flex items-center gap-2">
              <Text className="text-xl font-bold text-secondary">
                {selectedRepo?.name}
              </Text>
              <DownOutlined />
            </span>
          </Dropdown>
        </Col>

        {/* Navigate back button */}
        <Col span={8} className="flex justify-center">
          <Button
            icon={<IoMdArrowRoundBack />}
            shape="circle"
            onClick={() => {
              setCommitResponse(null);
              setSelectedRepo(null);
              setRepoResponse(null);
              /** Navigate to initial repo info page */
              navigate('/');
            }}
          />
        </Col>

        {/* Total commit count */}
        <Col span={8}>
          <Text className="flex justify-center text-sm">
            <RxCountdownTimer size={18} color="var(--color-secondary)" />
            {commitResponse?.length} commits
          </Text>
        </Col>

        {/* navigate to repo on github  */}
        <Col span={8} className="flex justify-center">
          <Button
            icon={<FaCode />}
            shape="circle"
            onClick={() => {
              chrome.tabs.create({ url: selectedRepo?.htmlUrl });
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default HomePageHeader;
