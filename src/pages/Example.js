import React from 'react';
import { connect } from 'dva/index';

@connect(({ example, loading }) => ({
  example,
  loading: loading.effects['example/example'] || false,
}))
export default class Example extends React.Component {
  state = {
  };

  render() {
    return (
      <div>example</div>
    );
  }
}
