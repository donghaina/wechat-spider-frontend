import Main from '@/view/main'

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/feed',
    name: 'feed',
    meta: {
      icon: 'social-buffer',
      title: '公众号'
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'feed_list',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '公众号列表'
        },
        component: () => import('@/view/feed/list.vue')
      },
      {
        path: 'create',
        name: 'feed_create',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '添加公众号'
        },
        component: () => import('@/view/feed/create.vue')
      },
      {
        path: ':feed_id',
        name: 'feed_edit',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '编辑公众号',
          hideInMenu: true
        },
        component: () => import('@/view/feed/edit.vue')
      },
      {
        path: ':wx_id/post/list',
        name: 'feed_post_list',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '公众号文章列表',
          hideInMenu: true
        },
        component: () => import('@/view/post/feed_posts.vue')
      }
    ]
  },
  {
    path: '/post',
    name: 'post',
    meta: {
      icon: 'social-buffer',
      title: '文章'
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'post_list',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '文章列表'
        },
        component: () => import('@/view/post/list.vue')
      },
      {
        path: ':post_id',
        name: 'post_detail',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '文章详情',
          hideInMenu: true
        },
        component: () => import('@/view/post/view.vue')
      },
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/view/error-page/404.vue')
  }
]
