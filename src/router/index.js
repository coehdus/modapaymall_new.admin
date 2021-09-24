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
		path: prefix + 'Manager/DistributorList'
		,name: 'ManagerDistributorList'
		,component: () => import('@/view/Manager/ManagerDistributorList.vue')
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
		path: prefix + 'Product/List/:page?'
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
		path: prefix + 'Product/Item/'
		,name: 'ProductItem'
		,component: () => import('@/view/Product/ProductItem.vue')
	}
	,{
		path: prefix + 'Product/Detail/:pdt_code?'
		,name: 'ProductDetail'
		,component: () => import('@/view/Product/ProductDetailSupply.vue')
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
		path: prefix + 'Banner/List/:page?'
		,name: 'BannerList'
		,component: () => import('@/view/Banner/BannerList.vue')
	}
	,{
		path: prefix + 'Banner/Item'
		,name: 'BannerItem'
		,component: () => import('@/view/Banner/BannerItem.vue')
	}
	,{
		path: prefix + 'Banner/Detail/:banner_uid'
		,name: 'BannerDetail'
		,component: () => import('@/view/Banner/BannerDetail.vue')
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
		path: prefix + 'Settlement/Management'
		,name: 'SettlementManagement'
		,component: () => import('@/view/Settlement/SettlementManagement')
	}
	,{
		path: prefix + 'Settlement/List'
		,name: 'SettlementList'
		,component: () => import('@/view/Settlement/SettlementList')
	}
	,{
		path: prefix + 'Settlement/Agency'
		,name: 'SettlementAgency'
		,component: () => import('@/view/Settlement/SettlementAgency')
	}
	,{
		path: prefix + 'Settlement/Supply'
		,name: 'SettlementSupply'
		,component: () => import('@/view/Settlement/SettlementSupply')
	}
	,{
		path: prefix + 'Settlement/Delivery'
		,name: 'SettlementDelivery'
		,component: () => import('@/view/Settlement/SettlementDelivery')
	}
	,{
		path: prefix + 'Settlement/Minus'
		,name: 'SettlementMinus'
		,component: () => import('@/view/Settlement/SettlementMinus')
	}
	,{
		path: prefix + 'Etc/Excel/Download'
		,name: 'EtcExcelDownload'
		,component: () => import('@/components/Excel')
	}
	,{
		path: prefix + 'Board/Bbs/:b_code/Item'
		,name: 'BbsItem'
		,component: () => import('@/view/Board/BbsItem')
	}
	,{
		path: prefix + 'Board/Bbs/:b_code/Detail/:bbs_uid'
		,name: 'BbsDetail'
		,component: () => import('@/view/Board/BbsDetail')
	}
	,{
		path: prefix + 'Board/Bbs/:b_code/Answer/:bbs_uid'
		,name: 'BbsAnswer'
		,component: () => import('@/view/Board/BbsAnswer')
	}
	,{
		path: prefix + 'CustomerCenter/Notice/List/:page?'
		,name: 'CustomerCenterNoticeList'
		,component: () => import('@/view/CustomerCenter/NoticeList')
	}
	,{
		path: prefix + 'CustomerCenter/QnA/List/:page?'
		,name: 'CustomerCenterQnAList'
		,component: () => import('@/view/CustomerCenter/QnAList')
	}
	,{
		path: prefix + 'CustomerCenter/Review/List/:page?'
		,name: 'CustomerCenterReviewList'
		,component: () => import('@/view/CustomerCenter/ReviewList')
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
