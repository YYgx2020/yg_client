import VueRouter from 'vue-router'
import Vue from 'vue'
import Cookies from 'js-cookie';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home'),
    meta: {
      title: '溢狗之家',
      index: 1
    }
  },
  {
    path: '/articleList',
    name: 'articleList',
    component: () => import('@/views/ArticleList'),
    meta: {
      title: '文章列表',
      index: 2
    }
  },
  {
    path: '/messageBoard',
    name: 'messageBoard',
    component: () => import('@/views/MessageBoard'),
    meta: {
      title: '留言板',
      index: 3,
    }
  },
  {
    path: '/self',
    name: 'self',
    component: () => import('@/views/Self'),
    meta: {
      title: '关于我',
      index: 4,
    }
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: {
      name: 'posts',
    },
    component: () => import('@/views/admin'),
    meta: {
      title: '个人中心',
      index: 5,
      isAuth: true
    },
    children: [
      {
        path: '',
        name: 'posts',
        component: () => import('@/views/admin/Posts'),
        meta: {
          title: '个人中心-我的文章',
          isAuth: true
        }
      },
      {
        path: 'drafts',
        name: 'drafts',
        component: () => import('@/views/admin/Drafts'),
        meta: {
          title: '草稿',
          isAuth: true
        }
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/admin/MessageBox'),
        meta: {
          title: '网友留言',
          isAuth: true
        }
      },
    ]
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('@/views/editor'),
    meta: {
      title: '写文章',
      index: 6,
      isAuth: true
    }
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('@/views/Detail'),
    meta: {
      // title: 
      index: 7,
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    meta: {
      title: 'Page not found',
    },
    component: () => import('@/views/NotFound')
  },
  // 所有未定义的路由跳转到 404
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 全局前置守卫
router.beforeEach((to,from,next)=>{
	console.log('beforeEach',to,from)
	if(to.meta.isAuth){ //判断当前路由是否需要进行权限控制
		// if(localStorage.getItem('school') === 'atguigu'){ //权限控制的具体规则
		// 	next() //放行
		// }else{
		// 	alert('暂无权限查看')
		// 	// next({name:'guanyu'})
		// }
    // 查看 cookie 中是否存在登录信息，存在则给跳转，不存在则不给跳转
    const token = Cookies.get('yg_c_token')
    if (token) {
      next() //放行
    } else {
      next({name: 'home'})
    }
	} else {
		next() //放行
	}
})

// 全局后置守卫：初始化时执行、每次路由切换后执行
router.afterEach((to,from)=>{
	console.log('afterEach')
  console.log('to: ', to);
  console.log('from: ', from);
	if(to.meta.title){ 
		document.title = to.meta.title //修改网页的title
	}else{
		document.title = '溢狗之家'
	}
})

export default router