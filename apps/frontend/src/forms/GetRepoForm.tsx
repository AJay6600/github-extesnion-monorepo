import { Resolver, useForm } from 'react-hook-form';
import { FormItem } from '../components/FormItem';
import { Input } from '../components/Input';
import { Avatar, Button, Card, Col, Row, Image, message, Modal } from 'antd';
import { FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { useState } from 'react';
import {
  GetAvatarResponseType,
  GetRepoResponseType,
} from '@github-extension-monorepo/typescript';
import { logger } from '../utils/helpers/logger';
import { getSessionStorageItem } from '../utils/helpers/getSessionFunc';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Select } from '../components/Select';

type GetRepoFormType = {
  userName: string;
  repoName: string;
};

const validationSchema = yup.object({
  userName: yup.string().required('Username is required'),
  repoName: yup.string().required('Repo name is required'),
});

const GetRepoForm = () => {
  /** This state store the avatar url */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  /** This state store the repositories data */
  const [reposOption, setReposOption] = useState<GetRepoResponseType[] | null>(
    null
  );

  /** This state will handle the opening of modal */
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /** This state will store the message for the modal */
  const [modalMessage, setModalMessage] = useState<string>();

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GetRepoFormType>({
    resolver: yupResolver(
      validationSchema
    ) as unknown as Resolver<GetRepoFormType>,
    defaultValues: { userName: '', repoName: undefined },
    mode: 'onChange',
  });

  const submitHandler = () => {
    console.log('Form Submitted');
  };

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
              reset();
              setAvatarUrl(null);
              setReposOption(null);
              setIsModalOpen(false);
            }}
          >
            Ok
          </Button>
        }
      >
        {modalMessage}
      </Modal>

      <Card className="mx-2 shadow-sm">
        <form onSubmit={handleSubmit(submitHandler)}>
          <Row justify="center" align="middle" gutter={[0, 24]}>
            <Col span={24} className="text-center">
              <Avatar
                size={80}
                className="bg-secondary"
                icon={
                  avatarUrl ? (
                    <Image src={avatarUrl} sizes="80" />
                  ) : (
                    <FaGithub color="var(--color-primary)" size={80} />
                  )
                }
              />
            </Col>

            <Col span={24}>
              <FormItem
                label="User name"
                isRequired
                errorText={errors && errors.userName && errors.userName.message}
              >
                <Input
                  name="userName"
                  placeholder="Enter github username"
                  rhfControllerProps={{ control }}
                  onChange={async (value) => {
                    setAvatarUrl(null);
                    setReposOption(null);

                    try {
                      const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_ENDPOINT}/user/avatar/${
                          value.target.value
                        }`,
                        {
                          headers: {
                            Authorization: `Bearer ${await getSessionStorageItem(
                              'token'
                            )}`,
                          },
                        }
                      );

                      const responseData =
                        response.data as GetAvatarResponseType;

                      setAvatarUrl(responseData.avatarUrl);
                    } catch (error) {
                      logger(error as Error);
                      message.error((error as Error).message);
                    }
                  }}
                  onBlur={async (e, value) => {
                    try {
                      const { data } = await axios.get(
                        `${
                          import.meta.env.VITE_BACKEND_ENDPOINT
                        }/user/repos/${value}`,
                        {
                          headers: {
                            Authorization: `Bearer ${await getSessionStorageItem(
                              'token'
                            )}`,
                          },
                        }
                      );

                      if (Array.isArray(data) && data.length > 0) {
                        const responseData = data as GetRepoResponseType[];

                        setReposOption(responseData);
                      } else if (
                        data['message'] === 'The user has no repositories'
                      ) {
                        setModalMessage('The user has no repositories');
                        setIsModalOpen(true);
                      }
                    } catch (error) {
                      setReposOption(null);
                      logger(error as Error);
                      message.error((error as Error).message);
                    }
                  }}
                />
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem
                label="Repository name"
                isRequired
                errorText={errors && errors.repoName && errors.repoName.message}
              >
                <Select
                  name="repoName"
                  placeholder="Enter github repo name"
                  rhfControllerProps={{ control }}
                  options={
                    reposOption
                      ? reposOption.map((repo) => ({
                          label: repo.name,
                          value: repo.id,
                        }))
                      : []
                  }
                  antdSelectProps={{ disabled: !reposOption }}
                />
              </FormItem>
            </Col>

            <Col span={24}>
              <Button htmlType="submit" className="w-full" type="primary">
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </Card>
    </>
  );
};

export default GetRepoForm;
