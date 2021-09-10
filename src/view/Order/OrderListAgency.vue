<template>
	<div
		class="full-height flex-column "
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getData"
			@click="getData"
			@toExcel="toExcel"
			@toItem="toItem"
		></Search>

		<div
			class="mt-10 full-height flex-column overflow-y-auto"
		>
			<ul
				class=" full-height flex-column overflow-y-auto"
			>
				<li
					v-for="(item) in item_list"
					:key="item.order_num_new"
					class="  mb-50 "
				>
					<div
						class="pa-10 justify-space-between color-black"
						:class="'bg-light-' + item.o_status_color"
					>
						<div class=" flex-1">
							<span class="color-black">[{{ item.o_status_name }}]</span>
							<span class="color-black"> {{ item.order_num_new}}</span>
						</div>

						<span class=" flex-1 color-black text-center">{{ item.pay_info }}</span>
						<span class=" flex-1 color-black text-center">총 판매가: {{ item.total_price | makeComma }} 원</span>
						<span class=" flex-1 color-black text-center">총 배송비: {{ item.delivery_price | makeComma }} 원</span>
						<span class=" flex-1 color-black text-center">결제금액: {{ item.order_price | makeComma }} 원</span>
						<span class="flex-1 color-black text-right">{{ item.wDate }}</span>
					</div>
					<div class="pa-10 under-line">
						<template
							v-for="o_status in codes.o_status"
						>
							<button
								v-if="o_status.code > 0"
								:key="'o_status_' + o_status.code"
								class=" prl-10 mr-10"
								:class="o_status.code != item.o_status ? 'bg-gray' : 'bg-light-' + o_status.color"
								@click="update(item, o_status.code)"
							>
								<span class="vertical-middle color-333 ">{{  o_status.name }}</span>
								<v-icon class="color-333">mdi mdi-chevron-right</v-icon>
							</button>
						</template>

						<div v-if="false">
						<button
							v-if="item.o_status == '1'"
							class=" bg-green prl-10 "
							@click="update(item, 2)"
						><span class="vertical-middle color-ddd ">입금 확인</span> <v-icon class="color-ddd">mdi mdi-chevron-right</v-icon></button>
						<button
							v-else-if="item.o_status == '2' || item.o_status == '3'"
							class="bg-light-red prl-10 "
							@click="update(item, 4)"
						><span class="vertical-middle color-eee">주문 취소</span> <v-icon class="color-eee">mdi mdi-chevron-right</v-icon></button>
						</div>
					</div>
					<div class="justify-space-between under-line ">
						<div
							class="pa-10 "
						>
							<span class="bg-black pa-5">주문자 정보</span>
							{{ item.member_id }} /
							{{ item.member_name }} /
							{{ item.member_tell }}
						</div>
						<div class="pa-10">
							<span class="bg-black pa-5">배송지 정보</span>
							{{ item.d_name }} /
							{{ item.d_tell }} /
							{{ item.d_post }}
							{{ item.d_addr1 }}
							{{ item.d_addr2 }}
						</div>
					</div>
					<ul>
						<li
							v-for="supply in item.supply_list"
							:key="'item_' + item.uid + 'supply_' + supply.uid"
							class="under-line-not-last"
						>
							<div class="pa-10 justify-space-between under-line-dashed ">
								<span class="flex-1 "><span class="bg-black pa-5">공급사 정보</span> {{ supply.seller_id }}</span>
								<span class="flex-1"></span>
								<span class="flex-1  text-center">공급가: {{ supply.total_purchase | makeComma }} 원</span>
								<span class="flex-1  text-center">판매가: {{ supply.total_price | makeComma }} 원</span>
								<span class="flex-1  text-center">배송비: {{ supply.delivery_price | makeComma }} 원</span>
								<span class="flex-1  text-center">합계: {{ supply.supply_total | makeComma }} 원</span>
								<span class="flex-1"></span>
							</div>
							<ul>
								<li
									v-for="odt in supply.odt_list"
									:key="'item_' + item.uid + 'supply_' + supply.uid + 'odt_' + odt.uid"
									class="pa-10 flex-row under-line-dashed"
								>
									<div
										class="pdt-img flex-2 justify-space-between"
									>
										<img
											v-if="odt.pdt_img"
											:src="odt.pdt_img"
											style="max-width: 120px;"
										/>
										<v-icon
											v-else
										>mdi mdi-image</v-icon>

										<div class="flex-1 flex-column justify-center ml-10">
											<span>상품명: {{ odt.pdt_name }}</span>
											<span class="color-gray mt-5">선택 옵션: {{ odt.op_name }}</span>
										</div>
									</div>
									<div class="flex-1 text-center flex-column justify-center">
										공급가: {{ odt.pdt_purchase | makeComma }} 원
									</div>
									<div class="flex-1 text-center flex-column justify-center">
										판매가: {{ odt.pdt_price | makeComma }} 원
									</div>
									<div class="flex-1 text-center flex-column justify-center">수량: {{ odt.op_cnt | makeComma }} 개</div>

									<div class=" flex-2 inline position-relative text-right flex-column justify-center">

										<div>
											<template
												v-for="(step, key) in codes.odt_status"
											>
												<button
													v-if=" odt.order_status == key"
													:key="key + '_' + item.uid"
													class="pa-5 mr-10"
													:class="odt.order_status == key ? 'bg-green' : 'bg-default'"
													:disabled="odt.not_confirm"
													@click="setOdtStatus(odt, key)"
												>{{ step.name }}</button>
											</template>

											<span class="pa-5 box mr-10 ">{{ odt.shipping_name ? odt.shipping_name : '택배사' }}</span>

											<span class="pa-5 box ">{{ odt.shipping_num ? odt.shipping_num : '송장번호' }}</span>
										</div>
									</div>
								</li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
		</div>

		<Pagination
			:options="search"
			class="text-center"
		></Pagination>

	</div>
</template>

<script>

import Pagination from "../../components/Pagination";
import Search from "../Layout/Search";

export default {
	name: 'ManagerAdminList'
	,
	components: {Search, Pagination},
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
				,list_cnt: 10
			}
			,search_option:{

				is_excel: true
				,is_cnt: true
				,sDate: true
				,eDate: true
				,cnt: 0
				,tCnt: 0
				,search_type: [
					{ name: '주문번호', column: 'order_num_new'}
					,{ name: '아이디', column: 'member_id'}
					,{ name: '이름', column: 'member_name'}
				]
				,select: [
					{ name: '주문상태', column: 'o_status', items: [
							{ name: '입금대기', column: '1'}
							,{ name: '결제완료', column: '2'}
							,{ name: '취소요청', column: '3'}
							,{ name: '주문취소', column: '4'}
						]
					}
				]
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
			,tCnt: 0
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

				item.supply_list.filter(function(supply){

					supply.odt_list.filter(function(odt){
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
						odt.step_group = odt.order_status.slice(-2, -1)

						odt.ATOKEN = self.TOKEN

						if(item.o_status != 2){
							odt.not_confirm = true
						}
					})

					supply.supply_total = (Number(supply.total_purchase) + Number(supply.delivery_price))
				})

				item.ATOKEN = self.TOKEN

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
					method: 'get'
					,url: 'management/getOrderList'
					,data: this.search
				})

				if(result.success){
					this.items = result.data.result
					this.$set(this.search, 'total_count', result.data.tCnt)
					this.search_option.tCnt = result.data.tCnt
					this.search_option.cnt = result.data.cnt
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
		,setOdtStatus: async function(odt, step){
			odt.next_step = step
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postOdtUpdate'
					,data: odt
				})

				if(result.success){
					odt.order_status = step
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,toExcel: function(){
			this.excel_data.content = this.items
			this.is_excel = true
		}
		,toItem: function (){
			this.is_item = !this.is_item
		}
		,update: async function(item, o_status){
			item.next_status = o_status
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postOrderUpdate'
					,data: item
				})

				if(result.success){
					item.o_status = o_status
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
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
		,'search.page': {
			handler: function(call){
				this.getData()
				this.$set(this.$route.params, 'page', call)
			}
		}
	}
}
</script>

<style>
.pdt-img img { width: 100%}
</style>