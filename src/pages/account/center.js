import React from 'react';
import { connect } from 'dva/index';
import { Avatar, Card } from 'antd';

@connect(({ login, loading }) => ({
  login,
  loading: loading.effects['example/example'] || false,
}))
export default class Center extends React.Component {
  state = {
    index: 1,
  };

  render() {
    const { teacherData: { nickName } } = this.props.login;
    return (
      <Card bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Avatar size={64} src={'http://img.52z.com/upload/news/image/20180108/20180108080910_40444.jpg'}
          style={{marginBottom:30}}
        />
        <p>姓名：{nickName}</p>
        <p>性别：{'男'}</p>
      </Card>
    );
  }
}
