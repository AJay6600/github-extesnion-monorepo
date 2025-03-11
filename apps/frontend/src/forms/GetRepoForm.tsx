import { useForm } from 'react-hook-form';
import { FormItem } from '../components/FormItem';
import { Input } from '../components/Input';
import { Avatar, Button, Card, Col, Row, Image } from 'antd';
import { FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { useState } from 'react';

type GetRepoFormType = {
  userName: string;
  repoName: string;
};

const GetRepoForm = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>();

  const {
    control,
    formState: { errors },
  } = useForm<GetRepoFormType>();
  return (
    <Card className="mx-2 shadow-sm">
      <form>
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
                  try {
                    const response = await axios.get(
                      `https://api.github.com/users/${value.target.value}`
                    );

                    const responseData = response.data;

                    setAvatarUrl(responseData['avatar_url']);
                  } catch (error) {
                    console.error('Error fetching GitHub user:', error);
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
              <Input
                name="repoName"
                placeholder="Enter github repo name"
                rhfControllerProps={{ control }}
              />
            </FormItem>
          </Col>

          <Col span={24}>
            <Button className="w-full" type="primary">
              Submit
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
  );
};

export default GetRepoForm;
