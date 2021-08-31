<template>
	<div
		class="side"
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
						v-if="item.type.indexOf(member_info.admin_type) > -1"
						:key="item.path"
						class="li-side-content "
						:class="'li-side-depth-' + item.depth"
					>
						<div
							class="pa-10 justify-space-between"
						>
							<span
								class="font-weight-bold"
							>{{ item.name }}</span>
						</div>
						<ul>
							<li
								v-for="sub in item.sub"
								:key="item.path + sub.path"
								class="pa-10 "
								:class="{'bg-gray-light': $route.name == item.path + sub.path }"
								@click="toPush(item, sub)"
							>
								<div
									class="justify-space-between"
								>
									<span>{{ sub.name }}</span>
									<v-icon
										v-if="$route.name != item.path + sub.path"
									>mdi mdi-chevron-right</v-icon>
								</div>
							</li>
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
						,type: ['admin']
						,sub: [
							{
								path: 'AdminList'
								,name: '관리자 목록'
								,params: {
									page: 1
								}
							}
							,{
								path: 'AgencyList'
								,name: '대리점 목록'
								,params: {
									page: 1
								}
							}
							,{
								path: 'SupplyList'
								,name: '공급사 목록'
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Member'
						,name: '회원관리'
						,type: ['admin', 'agency']
						,sub: [
							{
								path: 'List'
								,name: '회원목록'
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Product'
						,name: '상품 관리'
						,type: ['admin', 'agency', 'supply']
						,sub: [
							{
								path: 'Category'
								,name: '카테고리'
							}
							,{
								path: 'List'
								,name: '상품 목록'
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Order'
						,name: '주문 관리'
						,type: ['admin', 'agency', 'supply']
						,sub: [
							{
								path: 'List'
								,name: '주문 목록'
								,params: {
									page: 1
								}
							}
						]
					}
					,{
						path: 'Settlement'
						,name: '정산 관리'
						,type: ['admin', 'agency', 'supply']
						,sub: [
							{
								path: 'AgencyList'
								,name: '대리점 정산'
								,params: {
									page: 1
								}
							}
							,{
								path: 'SupplyList'
								,name: '공급사 정산'
								,params: {
									page: 1
								}
							}
							,{
								path: 'DeliveryList'
								,name: '배송비 정산'
								,params: {
									page: 1
								}
							}
							,{
								path: 'MinusList'
								,name: '정산 차감'
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
		background-color: gray;
		opacity: 0.5;
	}
	.side-container{
		height: 100%;
		position: relative;  z-index: 99;
		background-color: white;
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