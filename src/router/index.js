import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const prefix = '/'

const routes = [
	
	{
		path: prefix
		,name: 'intro'
		,component: () => import('@/view/Main/Index.vue')
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
		path: prefix + 'Auth/Find/Id'
		,name: 'FindId'
		,component: () => import('@/view/Auth/FindId.vue')
	}
	,{
		path: prefix + 'Auth/Find/Pw'
		,name: 'FindPw'
		,component: () => import('@/view/Auth/FindPw.vue')
	}
	,{
		path: prefix + 'Auth/Join/:code?'
		,name: 'Join'
		,component: () => import('@/view/Auth/Join.vue')
	}
	,{
		path: prefix + 'Auth/Result'
		,name: 'JoinResult'
		,component: () => import('@/view/Auth/Result.vue')
	}
	,{
		path: prefix + 'Member/List/:page?'
		,name: 'MemberList'
		,component: () => import('@/view/Member/MemberList.vue')
	}
	,{
		path: prefix + 'Manager/AdminList'
		,name: 'ManagerAdminList'
		,component: () => import('@/view/Manager/ManagerAdminList.vue')
	}
	,{
		path: prefix + 'Manager/AgencyList'
		,name: 'ManagerAgencyList'
		,component: () => import('@/view/Manager/ManagerAgencyList.vue')
	}
	,{
		path: prefix + 'Manager/SupplyList'
		,name: 'ManagerSupplyList'
		,component: () => import('@/view/Manager/ManagerSupplyList.vue')
	}
	,{
		path: prefix + 'Product/List/'
		,name: 'ProductList'
		,component: () => import('@/view/Product/ProductList.vue')
	}
	,{
		path: prefix + 'Product/ListAgency/'
		,name: 'ProductListAgency'
		,component: () => import('@/view/Product/ProductListAgency.vue')
	}
	,{
		path: prefix + 'Product/ListSupply/'
		,name: 'ProductListSupply'
		,component: () => import('@/view/Product/ProductListSupply.vue')
	}
	,{
		path: prefix + 'Product/Detail/:pdt_code?'
		,name: 'ProductDetail'
		,component: () => import('@/view/Product/ProductDetail.vue')
	}
	,{
		path: prefix + 'Product/Category'
		,name: 'ProductCategory'
		,component: () => import('@/view/Product/ProductCategory.vue')
	}
	,{
		path: prefix + 'Order/Cart'
		,name: 'Cart'
		,component: () => import('@/view/Order/Cart.vue')
	}
	,{
		path: prefix + 'Order/Form'
		,name: 'OrderForm'
		,component: () => import('@/view/Order/OrderForm.vue')
	}
	,{
		path: prefix + 'Order/Result/:order_number'
		,name: 'OrderResult'
		,component: () => import('@/view/Order/OrderResult.vue')
	}
	,{
		path: prefix + 'Order/List'
		,name: 'OrderList'
		,component: () => import('@/view/Order/OrderList.vue')
	}
	,{
		path: prefix + 'Order/ListSupply:page?'
		,name: 'OrderListSupply'
		,component: () => import('@/view/Order/OrderListSupply.vue')
	}
	,{
		path: prefix + 'Order/ListAgency/:page?'
		,name: 'OrderListAgency'
		,component: () => import('@/view/Order/OrderListAgency.vue')
	}
	,{
		path: prefix + 'Setting/Code/List'
		,name: 'SettingCodeList'
		,component: () => import('@/view/Setting/CodeList.vue')
	}
	,{
		path: prefix + 'Etc/Excel/Download'
		,name: 'EtcExcelDownload'
		,component: () => import('@/components/Excel')
	}
	,{
		path: prefix + '*',
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
	console.log('from: ' + from.path + ' to : ' + to.path)
	next();
});

export default router
