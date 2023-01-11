<template>
	<div
		v-if="!program.not_side"
		class="side bg-333"
	>
		<div
			class="side-container flex-column"
		>
			<ul
				class="side-content overflow-y pb-50"
			>
				<template
					v-for="item in items"
				>
					<li
						v-if="!item.not_view &&item.type.indexOf(user.role) > -1"
						:key="item.path"
						class="li-side-content cursor-pointer"
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
								v-for="(sub, index) in item.sub"
							>
								<li
									v-if="!sub.not_view && sub.type.indexOf(user.role) > -1"
									:key="item.path + sub.path + '_' + index"
									class="pa-10 "
									:class="{'bg-black': $route.name ? $route.name.indexOf(item.path + sub.path) > -1 : false}"
									@click="toPush(item, sub)"
								>
									<div
										class="justify-space-between"
									>
										<span class="flex-column justify-center ptb-5">{{ sub.name }}</span>
										<v-icon
											v-show="$route.name != item.path + sub.path"
											class="color-icon-dark"
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
		,props: ['Axios', 'user', 'program']
		,data: function(){
			return {
				items: [
					{
						path: 'Agency'
						,name: '영업점 '
						, type: ['admin', 'distributor']
						, sub: [
							{
								path: 'List'
								,name: '영업점 목록'
								,type: ['admin', 'distributor']
							}
						]
					}
					,{
						path: 'Supply'
						, name: '공급사 '
						, type: ['admin']
						, not_view: true
						, sub: [
							{
								path: 'List'
								,name: '공급사 목록'
								,type: ['admin', 'distributor']
							}
							,{
								path: 'Item'
								,name: '공급사 등록'
								,type: ['admin', 'distributor']
								,not_view: true
							}
							,{
								path: 'Detail'
								,name: '공급사 상세정보'
								,type: ['admin', 'distributor']
								,not_view: true
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
								,type: ['admin', 'agency']
							}
							,{
								path: 'List'
								,name: '상품 목록'
								,type: ['admin', 'distributor', 'agency', 'supply']
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
							}
							,{
								path: 'List'
								,name: '주문 목록'
								,type: ['supply']
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
								,type: ['manager']
							}
							,{
								path: 'List'
								,name: '정산 내역'
								,type: ['admin', 'distributor', 'agency', 'supply']
							}
							,{
								path: 'Agency'
								,name: '대리점 정산'
								,type: []
							}
							,{
								path: 'Agency'
								,name: '정산내역'
								,type: ['']
							}
							,{
								path: 'Supply'
								,name: '공급사 정산'
								,type: []
							}
							,{
								path: 'Supply'
								,name: '정산내역'
								,type: ['']
							}
							,{
								path: 'DeliveryList'
								,name: '배송비 내역'
								,type: ['admin', 'supply']
							}
							,{
								path: 'Minus'
								,name: '정산 차감'
								,type: []
							}
						]
					}
					,{
						path: 'Banner'
						,name: '배너 관리'
						,type: ['agency']
						,sub: [
							{
								path: 'List'
								,name: '배너 목록'
								,type: ['admin', 'agency']
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
								,type: ['admin']
							}
							,{
								path: 'QnAList'
								,name: '1:1문의'
								,type: ['admin', 'distributor', 'agency', 'supply']
							}
							,{
								path: 'ReviewList'
								,name: '상품 리뷰'
								,type: ['admin', 'distributor', 'agency', 'supply']
							}
						]
					}
					,{
						path: 'Pg'
						, name: 'PG 관리'
						, type: ['admin']
						, sub: [
							{
								path: 'List'
								, name: 'PG 목록'
								, type: ['admin']
							}
						]
					}
					,{
						path: 'Manager'
						, name: '설정'
						, type: ['manager']
						, sub: [
							{
								path: 'List'
								, name: '관리자 목록'
								, type: ['manager']
							}
							,{
								path: 'Setting'
								, name: '관리 설정'
								, type: ['admin']
							}
						]
					}
					,{
						path: 'Mypage'
						, name: '설정'
						, type: ['admin']
						, sub: [
							{
								path: 'Agency'
								, name: '관리 설정'
								, type: ['admin']
							}
						]
					}
					,{
						path: 'Mypage'
						, name: '설정'
						, type: ['supply']
						, sub: [
							{
								path: 'Supply'
								, name: '상점 설정'
								, type: ['supply']
							}
						]
					}
					,{
						path: 'Mypage'
						, name: '설정'
						, type: ['distributor', 'agency', ]
						, sub: [
							{
								path: 'Agency'
								, name: '상점 설정'
								, type: ['distributor', 'agency', ]
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
				console.log('toPush : ' +menu.path + sub.path)
				this.$storage.push({ name: menu.path + sub.path, params: sub.params})
			}
		}
		,created: function(){
			console.log('in side !!' + this.$route.name)
		}
	}
</script>

<style>

	.side {
		width: 180px;
		height: 100%;
		color: #bbb
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