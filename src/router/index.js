import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // createWebHistory 路由模式路径不带#号(生产环境下不能直接访问项目，需要 nginx 转发)
  // createWebHashHistory 路由模式路径带#号
  history: createWebHistory(), 
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login')
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/views/FeedBack')
    },
    {
      path: '/news/:id',
      name: 'news',
      component: () => import('@/views/News')
    },
    {
      path: '/bookclass',
      name: 'bookclass',
      component: () => import('@/views/BookClass')
    },
    {
      path: '/book_rank',
      name: 'bookRank',
      component: () => import('@/views/BookRank')
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('@/views/Pay')
    },
    {
      path: '/book/:id',
      name: 'book',
      component: () => import('@/views/Book')   
    },
    {
      path: '/chapter_list/:bookId',
      name: 'chapterList',
      component: () => import('@/views/ChapterList')
    },
    {
      path: '/book/:id/:chapterId',
      name: 'bookContent',
      component: () => import('@/views/BookContent')
    },
    {
      path: '/book/comment/:bookId',
      name: 'bookComment',
      component: () => import('@/views/BookComment.vue')
    },
    {
      path: '/book/comment/reply/:bookId/:commentId',
      name: 'bookCommentReply',
      component: () => import('@/views/BookCommentReply.vue')
    },
    {
      path: '/user/info',
      name: 'userInfo',
      component: () => import('@/views/UserInfo')
    },
    {
      path: '/user/favorites',
      name: 'userFavorites',
      component: () => import('@/views/UserFavorites')
    },
    {
      path: '/user/comment',
      name: 'userComment',
      component: () => import('@/views/UserComment')  
    },
    {
      path: '/user/feedback_list',
      name: 'userFeedbackList',
      component: () => import('@/views/UserFeedbackList')  
    },
    {
      path: '/user/payLog',
      name: 'userPayLog',
      component: () => import('@/views/UserPayLog')  
    },
    {
      path: '/user/consumeLog',
      name: 'userConsumeLog',
      component: () => import('@/views/UserConsumeLog')  
    },
    {
      path: '/user/setup',
      name: 'userSetup',
      component: () => import('@/views/UserSetup')
    },
    {
      path: '/user/set_name',
      name: 'setName',
      component: () => import('@/views/user/SetName.vue')
    },
    {
      path: '/user/set_sex',
      name: 'setSex',
      component: () => import('@/views/user/SetSex.vue')
    },
    {
      path: '/user/set_password',
      name: 'setPassword',
      component: () => import('@/views/user/SetPassword.vue')
    },
    {
      path: '/author/register',
      name: 'authorRegister',
      component: () => import('@/views/author/Register')
    },
    {
      path: '/author/book_list',
      name: 'authorBookList',
      component: () => import('@/views/author/BookList')
    },
    {
      path: '/author/book_add',
      name: 'authorBookAdd',
      component: () => import('@/views/author/BookAdd')
    },
    {
      path: '/author/chapter_list',
      name: 'authorChapterList',
      component: () => import('@/views/author/ChapterList')
    },
    {
      path: '/author/chapter_add',
      name: 'authorChapterAdd',
      component: () => import('@/views/author/ChapterAdd')
    },
    {
      path: '/author/chapter_update',
      name: 'authorChapterUpdate',
      component: () => import('@/views/author/ChapterUpdate')
    },
    {
      path: '/author/bookInfo',
      name: 'authorBookInfo',
      component: () => import('@/views/author/BookInfo')
    },
    {
      path: '/author/income',
  name: 'authorIncome',
  component: () => import('@/views/author/Income')
    }
  ]
})

// 解决 vue 中路由跳转时，总是从新页面中间开始显示
router.afterEach((to,from,next) => {
  window.scrollTo(0,0)
})

export default router