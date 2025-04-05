import { Resolver, useForm } from 'react-hook-form';
import { FormItem } from '../components/FormItem';
import { Input } from '../components/Input';
import { Avatar, Button, Card, Col, Row, Image, message, Modal } from 'antd';
import { FaGithub } from 'react-icons/fa';
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
import { useAppData } from '../contexts/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router';

/** Type for the get repo form */
type GetRepoFormType = {
  userName: string;
  repoName: string;
};

/** Form validation schema */
const validationSchema = yup.object({
  userName: yup.string().required('Username is required'),
  repoName: yup.string().required('Repo name is required'),
});

const GetRepoForm = () => {
  const navigate = useNavigate();

  const { setRepoResponse, setCommitResponse } = useAppData();

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

  /** This function handle the submission of form */
  const submitHandler = async (formData: GetRepoFormType) => {
    /** Update the repoResponse context */
    setRepoResponse(reposOption);

    /** set the commitResponseType as null initially */
    setCommitResponse(null);

    /** retrieve the repo api url from response */
    const selectedRepo = (
      reposOption && Array.isArray(reposOption) && reposOption.length > 0
        ? reposOption.filter((repo) => repo.id.toString() === formData.repoName)
        : []
    ) as GetRepoResponseType[];

    /** Select repo api link */
    const repoLink = selectedRepo && selectedRepo[0].apiUrl;

    try {
      /** Response data */
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/user/commits`,
        {
          repoLink,
        },
        {
          headers: {
            Authorization: `Bearer ${await getSessionStorageItem('token')}`,
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
        /** navigate to home page */
        navigate('/home', { state: { selectedRepoId: formData.repoName } });
      } else if (data['message'] === 'No commit found') {
        setModalMessage(`The ${selectedRepo[0].name} has no commits`);
        setIsModalOpen(true);
        setCommitResponse(null);
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
        error.response.data['message'] === 'Git Repository is empty.'
      ) {
        setModalMessage(error.response.data['message']);
        setIsModalOpen(true);
      } else {
        logger(err);
        message.error(err.message);
      }
      setCommitResponse(null);
    }
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
              setIsModalOpen(false);
            }}
          >
            Ok
          </Button>
        }
      >
        {modalMessage}
      </Modal>

      <Card className="mx-2 shadow-lg">
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
                        setRepoResponse(null);
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
