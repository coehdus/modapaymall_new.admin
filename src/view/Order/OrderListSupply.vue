<template>
	<div
		class="full-height flex-column"
	>
		<div
			class="full-height flex-column overflow-y-auto"
		>
			<div
				class="prl-10"
			>
				<div class=" pa-10 text-right bg-white">

					<input
						v-model="search.sDate"
						class="input-box-inline"
						placeholder="검색 기간 시작일"
					/>
					<span
						class="pa-10"
						style="display: inline-block;"
					> ~ </span>
					<input
						v-model="search.eDate"
						class="input-box-inline mr-10"
						placeholder="검색 기간 종료일"
					/>

					<select
						class="pa-10 mr-10"
						v-model="search.o_status"
						@change="getData"
					>
						<option
							:value="''"
						>결제상태</option>
						<option
							v-for="code in codes.o_status"
							:key="code.code"
							:value="code.code"
						>{{ code.name }}</option>
					</select>

					<select
						class="pa-10 mr-10"
						v-model="search.search_type"
					>
						<option
							:value="''"
						>검색조건</option>
						<option
							:value="'pdt_name'"
						>상품명</option>
						<option
							:value="'member_id'"
						>주문자 ID</option>
						<option
							:value="'member_name'"
						>주문자명</option>
					</select>

					<input
						v-model="search.search_value"
						class="input-box-inline"
						placeholder="검색어를 입력하세요"
					/>

					<button
						class="btn-blue pa-10 vertical-middle "
						@click="getData"
					>검색</button>
				</div>
			</div>
			<ul
				class="pa-10"
			>
				<li
					v-for="(item) in item_list"
					:key="item.order_num_new"
					class="pa-10 box-shadow mb-10 bg-white"
				>
					<div
						class="justify-space-between color-white"
						:class="'bg-light-' + item.o_status_color"
					>

						<div class="pa-10 flex-1">
							<span class="color-white">[{{ item.o_status_name }}]</span>
							<span class="color-white"> {{ item.order_num_new}}</span>
						</div>

						<span class="pa-10 flex-1 color-white text-center">총 상품가: {{ item.total_price | makeComma }} 원</span>
						<span class="pa-10 flex-1 color-white text-center">배송비: {{ item.delivery_price | makeComma }} 원</span>
						<span class="pa-10 flex-1 color-white text-right">{{ item.wDate }}</span>
					</div>
					<div class="justify-space-between under-line ">
						<div
							class="pa-10"
						>
							{{ item.member_name }} <br/>
							{{ item.member_tell }}
						</div>
						<div class="pa-10">
							{{ item.d_name }} <br/>
							{{ item.d_tell }} <br/>
							{{ item.d_post }}
							{{ item.d_addr1 }}
							{{ item.d_addr2 }}
						</div>
					</div>
					<ul>
						<li
							v-for="odt in item.odt_list"
							:key="'odt_' + odt.uid"
							class="pa-10 flex-row under-line-dashed"
						>
							<div
								class="pdt-img flex-1"
								style="max-height: 40px; overflow: hidden;"
							>
								<img
									v-if="odt.pdt_img"
									:src="odt.pdt_img"
									style="max-width: 120px;"
									/>
								<v-icon
									v-else
								>mdi mdi-image</v-icon>
							</div>
							<div class="flex-1 flex-column">
								<span>상품명: {{ odt.pdt_name }}</span>
								<span>선택 옵션: {{ odt.op_name }}</span>
							</div>
							<div class="flex-1">공급가: {{ odt.pdt_purchase | makeComma }}</div>
							<div class="flex-1">수량: {{ odt.op_cnt | makeComma }}</div>
							<div>{{ odt.order_status_name }}</div>

							<div class=" flex-2 inline position-relative text-right">
								<div
									v-if="false"
									class="position-absolute "
									style="width: 100%; height: 100%; opacity: 0.5; background-color: gray; z-index: 9"
								></div>
								<select
									class="box pa-5 vertical-middle mr-5"
								>
									<option
										:value="''"
									>택배사 선택</option>
									<option
										v-for="(v, index) in codes.parcel"
										:key="'parcel_' + index"
										:value="index"
									>{{ v.name }}</option>
								</select>

								<input
									class="box pa-5 vertical-middle mr-5"
									placeholder="송장번호"
								/>
								<button
									class="btn-success pa-5 vertical-middle"
								>등록</button>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>

		<Pagination
			:options="options"
			class="text-center"
		></Pagination>

	</div>
</template>

<script>

import Pagination from "../../components/Pagination";

export default {
	name: 'ManagerAdminList'
	,
	components: { Pagination},
	props: ['Axios', 'TOKEN', 'codes', 'rules']
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
				,o_status: ''
				,search_type: ''
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