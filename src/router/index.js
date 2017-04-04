
//import AV from 'leancloud-storage';
const routers = [
     //首页
    {
      path: '/',
      name: 'index',
      component(resolve) {
         require.ensure(['../App.vue'], () => {
          resolve(require('../App.vue'));
         });
      },
      children: [
        {
          path: '/home',
          name: 'home',
          component(resolve) {
            require.ensure(['../components/Home.vue'], () => {
               resolve(require('../components/Home.vue'));
            });
          }
        },
        {
          path: '/discovery',
          name: 'discovery',
          component(resolve) {
            require.ensure(['../components/discovery.vue'], () => {
              resolve(require('../components/discovery.vue'));
            });
          }
        },
        {
          path: '/tips',
          name: 'tips',
          component(resolve) {
            require.ensure(['../components/tips.vue'], () => {
              resolve(require('../components/tips.vue'));
            });
          }
        },
        {
          path: '/user/:userId',
          name: 'user',
          component(resolve) {
            require.ensure(['../components/User.vue'], () => {
              resolve(require('../components/User.vue'));
            });
          },
          children: [
            {
              path: 'setting',
              name: 'setting',
              component(resolve) {
                require.ensure(['../components/setting.vue'], () => {
                  resolve(require('../components/setting.vue'));
                });
              },
              children: [
                {
                  path: 'userSetting',
                  name: 'userSetting',
                  component(resolve) {
                    require.ensure(['../components/UserSetting.vue'], () => {
                      resolve(require('../components/UserSetting.vue'));
                    })
                  }
                },
                {
                  path: 'about',
                  name: 'about',
                  component(resolve) {
                    require.ensure(['../components/About.vue'], () => {
                      resolve(require('../components/About.vue'));
                    })
                  }
                },
                {
                  path: 'feedback',
                  name: 'feedback',
                  component(resolve) {
                    require.ensure(['../components/Feedback.vue'], () => {
                      resolve(require('../components/Feedback.vue'));
                    })
                  }
                },
              ]
            }
          ]
        },
        {
          path: 'pictureDetail/:pictureId',
          name: 'pictureDetail',
          component(resolve) {
            require.ensure(['../components/pictureDetail.vue'], () => {
              resolve(require('../components/pictureDetail.vue'));
            })
          }
        },
          {
              path: 'classDetail/:classId',
              name: 'classDetail',
              component(resolve) {
                require.ensure(['../components/classDetail.vue'], () => {
                  resolve(require('../components/classDetail.vue'));
                });
              }
          },
         {
          path: 'classDetail/:classId',
          name: 'disClassDetail',
          component(resolve) {
            require.ensure(['../components/classDetail.vue'], () => {
              resolve(require('../components/classDetail.vue'));
            });
          }
        },
        {
          path: 'otherUser/:userId',
          name: 'otherUser',
          component(resolve) {
            require.ensure(['../components/otherUser.vue'], () => {
              resolve(require('../components/otherUser.vue'));
            });
          }
        }
      ]
    },
    {
      path:'*', redirect: '/home'
    }
]

export default routers;
