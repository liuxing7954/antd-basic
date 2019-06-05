// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: {
    ie: 11,
  },

  /**
   * 路由相关配置
   */
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        { path: '/user', redirect: '/user/login' },
        {
          path: '/user/login',
          name: 'login',
          icon: 'block',
          component: './Login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/', redirect: '/analysis' },
        // dashboard
        {
          path: '/analysis',
          name: 'analysis',
          icon: 'smile',
          routes: [
            { path: '/analysis', redirect: '/analysis/analysis' },
            {
              path: '/analysis/analysis',
              name: 'analysis',
              component: './Index',
            },
            {
              path: '/analysis/config',
              name: 'config',
              component: './Index/config',
            },
            {
              path: '/analysis/history',
              name: 'history',
              component: './Index/history',
            },
          ],
        },
        {
          path: '/account',
          name: 'account',
          icon: 'user',
          routes: [
            {
              path: '/account/center',
              name: 'center',
              component: './account/center',
            },
            {
              path: '/account/changePwd',
              name: 'changePwd',
              component: './account/changePwd',
            },
          ],
        },
      ],
    },
  ],
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
};
