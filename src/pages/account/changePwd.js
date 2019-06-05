import React from 'react';
import { connect } from 'dva/index';
import { Avatar, Button, Card, Checkbox, Form, Icon, Input } from 'antd';

@connect(({ login, loading }) => ({
  login,
  loading: loading.effects['example/example'] || false,
}))
@Form.create({ name: 'change_pwd' })
export default class ChangePwd extends React.Component {
  state = {
    index: 1,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        alert('修改成功');
        this.props.form.resetFields()
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致');
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { teacherData: { nickName } } = this.props.login;
    const itemStyle = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 8,
      },
    };
    return (
      <Card>
        <Form layout='horizontal' {...itemStyle} onSubmit={this.handleSubmit}>
          <Form.Item label={'旧密码'} hasFeedback>
            {getFieldDecorator('old_password', {
              rules: [{ required: true, message: '旧密码不能为空' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item label={'新密码'} hasFeedback>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '新密码不能为空' },
                {
                  min: 6, max: 10, message: '密码长度应为6-10位',
                }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item label={'确认新密码'} hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                { required: true, message: '确认密码不能为空' },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
