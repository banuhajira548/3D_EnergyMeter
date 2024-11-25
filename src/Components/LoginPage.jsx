import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import loginImage from '../assets/login.png'; // Import the image
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const { Title, Text } = Typography;

const SignUpPage = () => {
  const [form] = Form.useForm();
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const onFinishSignUp = (values) => {
    console.log('Sign Up submitted:', values);
    message.success('Account created successfully!');
  };

  const onFinishSignIn = (values) => {
    console.log('Sign In submitted:', values);
    message.success('Logged in successfully!');
    navigate('/dashboard'); // Redirect to a generic dashboard
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${loginImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 4 }}>
          {isSignUp ? 'Sign up' : 'Sign in'}
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 30 }}></Text>

        <Form
          form={form}
          name={isSignUp ? 'signup' : 'signin'}
          onFinish={isSignUp ? onFinishSignUp : onFinishSignIn}
          initialValues={{ remember: true }}
        >
          {isSignUp && (
            <>
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="centralmanufacturing@cmti.res.in" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your Password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') }]}
              >
                <Checkbox>I agree to the terms of service</Checkbox>
              </Form.Item>
            </>
          )}

          {!isSignUp && (
            <>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {isSignUp ? 'Create Account' : 'Login'}
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ display: 'block', textAlign: 'center' }}>
          {isSignUp ? 'Already a member?' : 'Not a member yet?'}{' '}
          <a onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign in' : 'Sign up'}
          </a>
        </Text>
      </Card>
    </div>
  );
};

export default SignUpPage;
