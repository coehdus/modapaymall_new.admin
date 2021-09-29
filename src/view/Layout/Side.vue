<template>
	<div
		class="side bg-base"
	>
		<div
			class="side-container flex-column"
		>
			<ul
				class="side-content overflow-y-auto"
			>
				<template
					v-for="item in items"
				>
					<li
						v-if="item.type.indexOf(member_info.admin_type_code) > -1"
						:key="item.path"
						class="li-side-content "
						:class="'li-side-depth-' + item.depth"
					>
						<div
							class="pa-10 justify-space-between"
						>
							<span
								class="font-weight-bold flex-column justify-center ptb-5"
							>{{ item.name }}</span>
						</div>
						<ul>
							<template
								v-for="sub in item.sub"
							>
								<li
									v-if="sub.type.indexOf(member_info.admin_type_code) > -1"
									:key="item.path + sub.path"
									class="pa-10 "
									:class="{'bg-black': $route.name.indexOf(item.path + sub.path) > -1}"
									@click="toPush(item, sub)"
								>
									<div
										class="justify-space-between"
									>
										<span class="flex-column justify-center ptb-5">{{ sub.name }}</span>
										<v-icon
											v-show="$route.name != item.path + sub.path"
											class="color-icon"
										>mdi mdi-chevron-right</v-icon>
									</div>
								</li>
							</template>
						</ul>
					</li>
				</template>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Side'
		,props: ['Axios', 'member_info']
		,data: function(){
			return {
				items: [
					{
						path: 'Manager'
						,name: '관리자'
						,type: ['admin', 'distributor']
						,sub: [
							{
								path: 'AdminList'
								,name: '관리자 목록'
								,type: ['admin']
								,params: {
									page: 1
								}
							}
							,{
								path: 'DistributorList'
								,name: '총판 목록'
								,type: ['admin']
								,params: {
									page: 1
								}
							}
							,{
								path: 'AgencyList'
								,name: '대리점 목록'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
							,{
								path: 'SupplyList'
								,name: '공급사 목록'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Member'
						,name: '회원관리'
						,type: ['admin', 'distributor', 'agency']
						,sub: [
							{
								path: 'List'
								,name: '회원목록'
								,type: ['admin', 'distributor', 'agency']
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Product'
						,name: '상품 관리'
						,type: ['admin', 'distributor', 'agency', 'supply']
						,sub: [
							{
								path: 'Category'
								,name: '카테고리'
								,type: ['admin', 'distributor']
							}
							,{
								path: 'List'
								,name: '상품 목록'
								,type: ['admin', 'distributor', 'agency', 'supply']
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Banner'
						,name: '배너 관리'
						,type: ['admin', 'distributor']
						,sub: [
							{
								path: 'List'
								,name: '배너 목록'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Order'
						,name: '주문 관리'
						,type: ['admin', 'distributor', 'agency', 'supply']
						,sub: [
							{
								path: 'List'
								,name: '주문 목록'
								,type: ['admin', 'distributor', 'agency']
								,params: {
									page: 1
								}
							}
							,{
								path: 'ListSupply'
								,name: '주문 목록'
								,type: ['supply']
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'CustomerCenter'
						,name: '고객센터'
						,type: ['admin', 'distributor', 'agency', 'supply']
						,sub: [
							{
								path: 'NoticeList'
								,name: '공지사항'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
							,{
								path: 'QnAList'
								,name: '1:1문의'
								,type: ['admin', 'distributor', 'agency', 'supply']
								,params: {
									page: 1
								}
							}
							,{
								path: 'ReviewList'
								,name: '상품 리뷰'
								,type: ['admin', 'distributor', 'agency', 'supply']
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Settlement'
						,name: '정산 관리'
						,type: ['admin', 'distributor', 'agency', 'supply']
						,sub: [
							{
								path: 'Management'
								,name: '정산 실행'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
							,{
								path: 'List'
								,name: '정산 내역'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
							,{
								path: 'Agency'
								,name: '대리점 정산'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
							,{
								path: 'Agency'
								,name: '정산내역'
								,type: ['agency']
								,params: {
									page: 1
								}
							}
							,{
								path: 'Supply'
								,name: '공급사 정산'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
							,{
								path: 'Supply'
								,name: '정산내역'
								,type: ['supply']
								,params: {
									page: 1
								}
							}
							,{
								path: 'Delivery'
								,name: '배송비 정산'
								,type: ['admin', 'distributor', 'agency', 'supply']
								,params: {
									page: 1
								}
							}
							,{
								path: 'Minus'
								,name: '정산 차감'
								,type: ['admin', 'distributor']
								,params: {
									page: 1
								}
							}
						]
					}
				]
				,item_new: {

				}
			}
		}
		,computed: {
			item_list: function(){
				return this.items.filter(function(item){

					if(item.type.indexOf())

					return item.sub.filter(function(sub){

						return sub
					})
				})
			}
		}
		,methods: {
			toPush: function(menu, sub){
				console.log(menu.path + sub.path)
				this.$emit('push', menu.path + sub.path )
			}
		}
		,created: function(){
			console.log('in side !!')
		}
	}
</script>

<style>

	.side {
		width: 180px;
		height: 100%;
	}
	.bg-side {
		width: 100%; height: 100%;
		position: fixed; left: 0; top: 0; z-index: 98;
		opacity: 0.5;
	}
	.side-container{
		height: 100%;
		position: relative;  z-index: 99;
		overflow-y: auto;
		border-right: 1px solid #ddd
	}

	.side-container {

	}

	.li-side-content {
		border-bottom: 1px solid #ddd;
	}
	.li-side-depth-1 {
		text-indent: 0px;
	}
	.li-side-depth-2 {
		text-indent: 10px;
	}
	.li-side-depth-3 {
		text-indent: 20px;
	}
	.li-side-depth-4 {
		text-indent: 30px;
	}
</style>