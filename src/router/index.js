import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const prefix = '/'

const routes = [
	
	{
		path: '/'
		,name: 'intro'
		,component: () => import('@/view/Main/Intro.vue')
	}
	,{
		path: prefix + 'Index'
		,name: 'Index'
		,component: () => import('@/view/Main/Index.vue')
	}
	,{
		path: prefix + 'Auth/Login'
		,name: 'Login'
		,component: () => import('@/view/Auth/Login.vue')
	}
	,{
		path: '*',
		name:'404', 
		component: () => import('@/view/Error/NotFound.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	next();
});

export default router
