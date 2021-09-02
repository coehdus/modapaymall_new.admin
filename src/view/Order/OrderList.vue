<template>
	<div
		class="full-height justify-space-between"
	>
		<div
			class="full-height full-width flex-column"
		>
			<table>
				<colgroup>
					<col width="80px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="auto" />
				</colgroup>
				<thead>
				<tr>
					<th>
						<input
							type="checkbox"
						/>
					</th>
					<th>주문번호</th>
					<th>아이디</th>
					<th>이름</th>
					<th>연락처</th>
					<th>결제 정보</th>
					<th>결제상태</th>
					<th>상세정보</th>
				</tr>
				</thead>
				<tbody>
				<template
					v-for="(item) in item_list"
				>
					<tr
						:key="item.admin_id"
						:class="{ 'bg-f5': item.uid == item_new.uid }"
					>
						<td
						>
							<input
								v-model="item.is_watch"
								type="checkbox"
							/>
						</td>
						<td>
							{{ item.order_num_new }}
						</td>
						<td @click="item.is_detail = !item.is_detail">{{ item.member_id }}</td>
						<td>{{ item.member_name }}</td>
						<td>{{ item.member_tell }}</td>
						<td>{{ item.order_price | makeComma }} 원</td>

						<td
							class="full-height "
						>
							<div
								class=" flex-row justify-center"
							>
								<template
									v-for="o_status in codes.o_status"
								>
								<button
									v-if="o_status.code > 0"
									:key="'o_status_' + o_status.code"
									class="pa-5 "
									:class="'bg-' + (item.o_status == o_status.code ? o_status.color : 'default')"
									@click="item.o_status = o_status.code; item.is_watch = true"
								>{{ o_status.name }}</button>
								</template>
							</div>
						</td>
						<td
						>
							<v-icon
								v-if="item.uid == item_new.uid"
								class="color-red"
								@click="setItem(item)"
							>mdi mdi-close-box-outline</v-icon>
							<v-icon
								v-else
								@click="setItem(item)"
							>mdi mdi-arrow-right-bold-box-outline</v-icon>
						</td>
					</tr>
				</template>
				</tbody>
			</table>

			<div
				class="mt-auto"
			>
				<Pagination
					:program="program"
					:align="'center'"
					:options="options"
				></Pagination>
			</div>
		</div>

		<SideB
			v-if="item_new.uid"
			:title="'주문 정보'"
			:bg-title="'bg-' + item_new.o_status_color"
			width="350px"
		>
			<div
				slot="item"
				class="pa-10 flex-column full-height overflow-y-auto"
			>
				<h6>주문번호</h6>
				<div
					class="mt-10 pa-10 size-px-16 text-center  box-shadow bg-white"
				>
					{{ item_new.order_num_new }}
				</div>

				<div class="mt-30">
					<h6>상품 정보</h6>
					<div></div>
				</div>

				<template
					v-if="item_new.odt_list.length > 0"
				>
					<ul class="mt-10">
						<li
							v-for="(item, item_index) in odt_list"
							:key="item_index"
							class="under-line mb-10  bg-white box-shadow"
						>
							<div
								class="pa-10 under-line "
							><v-icon>mdi mdi-home-modern</v-icon>{{ item.company.seller_name }}</div>
							<ul>
								<li
									v-for="(product, product_index) in item.items"
									:key="'product_' + product_index"
									class=" under-line justify-space-between"
								>
									<div class="pa-10 flex-1 odt-img justify-center flex-column pdt-img">
										<img
											v-if="product.pdt_img"
											:src="'http://delimall.co.kr/API/data/product/' + product.pdt_img" alt="main1"
										/>
										<v-icon
											v-else
										>mdi mdi-image</v-icon>
									</div>
									<div class="flex-3">
										<div class=" ptb-10 under-line">{{ product.pdt_name }}</div>
										<div
											v-for="(option, index) in product.options"
											:key="'odt_' + index"
											class=" pa-10 under-line-dashed"
										>
											<div class="justify-space-between">
												<span>옵션</span>
												<span>{{ option.odt }}</span>
											</div>
											<div
												class="mt-10 justify-space-between"
											>
											<span
												class="flex-2 color-blue"
											>{{ option.odt_price | makeComma }}</span>

												<span>{{ option.odt_cnt }} 개</span>
											</div>
										</div>

									</div>
								</li>
							</ul>
							<div
								class="pa-10 justify-space-between under-line-dashed"
							>
								<span>배송비 <span class="size-px-11">{{ item.company.delivery }}</span></span>
								<span>{{ item.company.delivery_price | makeComma }}</span>
							</div>
							<div
								class="pa-10 justify-space-between"
							>
								<span>합계</span>
								<span class="color-blue">{{ item.company.total_price | makeComma }}</span>
							</div>
						</li>
					</ul>
				</template>


				<h6 class="mt-20">결제 정보</h6>
				<div
					class="mt-10 pa-10 bg-white box-shadow"
				>
					<div class=" justify-space-between">
						<span>결제금액</span>
						<span><span class="color-blue">{{ item_new.order_price | makeComma }}</span> 원</span>
					</div>
					<div class="mt-10  justify-space-between">
						<span class="ptb-5">{{ item_new.pay_div_name }}</span>

						<span class='pa-5' :class="'bg-' + item_new.o_status_color">{{ item_new.o_status_name }}</span>
					</div>
					<div class="mt-10  ">
						{{ item_new.pay_info }}
					</div>
				</div>

				<div class="mt-30">
					<h6>주문자 정보</h6>
					<div
						class="mt-10 pa-10 bg-white box-shadow"
					>
						<div class=" justify-space-between">
							<span>이름</span>
							<span>{{ item_new.member_name }}</span>
						</div>
						<div class="mt-5  justify-space-between">
							<span>연락처</span>
							<span>{{ item_new.member_tell }}</span>
						</div>
						<div class="mt-5  justify-space-between">
							<span>이메일</span>
							<span>{{ item_new.member_email }}</span></div>
					</div>
				</div>

				<div class="mt-30">

					<h6>배송지 정보</h6>

					<div
						class="mt-10 bg-white pa-10 box-shadow"
					>
						<div class=" justify-space-between">
							<span>받는분 이름</span>
							<span>{{ item_new.d_name }}</span>
						</div>
						<div class="mt-10  justify-space-between">
							<span>받는분 연락처</span>
							<span>{{ item_new.d_tell }}</span>
						</div>
						<div class="mt-10 ">
							{{ item_new.d_post }}
							{{ item_new.d_addr1 }}
							{{ item_new.d_addr2 }}
						</div>

					</div>
				</div>
			</div>
		</SideB>
	</div>
</template>

<script>

import Pagination from "../../components/Pagination";
import SideB from "../Layout/SideB";

export default {
	name: 'ManagerAdminList'
	,
	components: {SideB, Pagination},
	props: ['Axios', 'TOKEN', 'codes', 'rules', 'member_info']
	,data: function (){
		return {
			program: {
				name: '주문 목록'
				,top: true
				,title: true
			}
			,options: {

			}
			,search: {
				ATOKEN: this.TOKEN
			}
			,items: [

			]
			,item_new: {
				admin_level: 0
			}
			,levels: [
				{ code: 99, name: '최고관리자'}
				,{ code: 50, name: '총판관리자'}
				,{ code: 1, name: '일반관리자'}
			]
			,status: [
				{ code: 99, name: '최고관리자'}
				,{ code: 50, name: '총판관리자'}
				,{ code: 1, name: '일반관리자'}
			]
		}
	}
	,computed: {
		item_list: function (){

			console.log(11)
			let self = this
			return this.items.filter(function(item){
				let o_status = self.codes.o_status[Number(item.o_status)]

				if(o_status) {
					item.o_status_name = o_status.name
					item.o_status_color = o_status.color
				}

				let pay_div = self.codes.pay_div[item.pay_div]
				item.pay_div_name = pay_div.name

				item.odt_list.filter(function(odt){
					if(odt.pdt_img1){
						odt.pdt_img = self.codes.img_url + odt.pdt_img1
					}else{
						odt.pdt_img = ''
					}

					let order_status = self.codes.odt_status[odt.order_status]

					if(order_status){
						odt.order_status_name = order_status.name
						odt.order_status_color = order_status.color
					}
				})

				return item
			})
		}

		,odt_list: function(){
			let items = {}

			for(const [key ,val] of Object.entries(this.item_new.odt_list)){
				console.log('key: ' + key)

				if(val.is_not_select){
					continue
				}
				let company = items[val.seller_id]

				if(!company){
					company = {
						company: {
							total_price: 0
						}
						,items: {}
					}
				}

				items[val.seller_id] = company

				items[val.seller_id]['company']['seller_id'] = val.seller_id
				items[val.seller_id]['company']['seller_name'] = val.shop_name
				items[val.seller_id]['company']['total_price'] += ((Number(val.pdt_price) + Number(val.op_price)) * val.op_cnt)
				items[val.seller_id]['company']['delivery_type'] = val.delivery_type
				items[val.seller_id]['company']['delivery_price'] = val.delivery_price

				if(val.delivery_type == '무료'){
					items[val.seller_id]['company']['delivery_price'] = val.delivery_type
					items[val.seller_id]['company']['delivery'] = ''
				}else{
					if(val.free_price > 0){
						items[val.seller_id]['company']['delivery'] = val.free_price + ' 이상 구매시 무료'
						if(val.free_price < items[val.seller_id]['company']['total_price']){
							items[val.seller_id]['company']['delivery_price'] = 0
						}
					}
				}

				let product = items[val.seller_id]['items'][val.pdt_uid]

				if(!product || product === undefined){
					product = {
						pdt_uid: val.pdt_uid
						,pdt_img: val.pdt_img1
						,pdt_name: val.pdt_name
						,pdt_price: val.pdt_price
						,options: {}
					}
				}

				items[val.seller_id]['items'][val.pdt_uid] = product

				let option = items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid]
				if(!option || option === undefined){
					option = {
						odt: val.op_name
						,odt_cnt: val.op_cnt
						,odt_price: Number(val.pdt_price) + Number(val.op_price)
					}
				}

				items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid] = option
			}
			console.log(items)
			return items
		}
	}
	,methods: {
		getData: async function(){

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getOrderList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data.result
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,setItem: function (item){
			if(this.item_new.uid == item.uid){
				this.item_new = {
					ATOKEN: this.TOKEN
				}
			}else {
				this.item_new = item
			}
		}
	}
	,created() {
		if(this.member_info.admin_type == 'supply'){
			this.$router.push({ name: 'OrderListSupply'})
		}else if(this.member_info.admin_type == 'agency') {
			this.$router.push({name: 'OrderListAgency'})
		}
		this.$emit('onLoad', this.program)
		this.getData()
	}
	,watch: {
		items: {
			deep: true
			,handler: function(){
			}
		}
	}
}
</script>

<style>
	.pdt-img img { width: 100%}
</style>