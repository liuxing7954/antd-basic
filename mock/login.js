export default {
  'post /api/login': function(req, res) {
    // debugger
    // if (req.username != 'admin' || req.password != 'bd**123') {
    //   res.json({
    //     error_code: -1,
    //     msg: '账号密码错误',
    //   });
    //   return;
    // }
    const responseObj = {
      'error_code': 0,
      'msg': '成功',
      'data': { 'id': 1, 'username': 'admin', 'pass': 'bd**123', 'nickName': '帅哥季' },
    };
    res.json(responseObj);
  },
};
