import React, { useState } from 'react'
import { Form, Icon, Input, Button } from 'antd';

function AddInfo(props) {
  const { getFieldDecorator } = props.form;
  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  return (
    <Form onSubmit={handleSubmit} layout="inline">
      <Form.Item label='classRoomName'>
        {getFieldDecorator('classRoomName')(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />,
        )}
      </Form.Item>
      <Form.Item label='students'>
        {getFieldDecorator('students')(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="students"
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" >
          提交
          </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AddInfo);