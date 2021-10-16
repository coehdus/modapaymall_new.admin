<template>
	<div
		class="full-height flex-column "
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getSearch"
			@click="getSearch"
			@toExcel="toExcel"
			@toItem="toItem"
		>
			<select
				slot="add"
				v-model="search.o_status"
				class="pa-5-10 mr-10"
				@change="toSearch"
			>
				<option value="">{{ codes.O001.code_name }}</option>
				<option
					v-for="o_status in codes.O001.items"
					:key="'o_status_' + o_status.total_code"
					:value="o_status.code_value"
				>{{ o_status.code_name }}</option>
			</select>
			<select
				slot="add"
				v-model="search.order_status"
				class="pa-5-10 mr-10"
				@change="toSearch"
			>
				<option value="">{{ codes.O002.code_name }}</option>
				<option
					v-for="order_status in codes.O002.items"
					:key="'order_status' + order_status.total_code"
					:value="order_status.code_value"
				>{{ order_status.code_name }}</option>
			</select>
		</Search>

		<div
			class="mt-10 full-height flex-column overflow-y-auto"
		>
			<ul
				v-if="items.length > 0"
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
						<div class=" ">
							<span class="color-black">[{{ item.o_status_name }}]</span>
							<span class="color-black"> {{ item.order_num_new}}</span>
						</div>

						<span class=" color-black text-center ml-40">
							총 판매가: {{ item.total_price | makeComma }} 원 /
							총 배송비: {{ item.delivery_price | makeComma }} 원 /
							결제금액: <span class="font-weight-bold">{{ item.order_price | makeComma }}</span> 원
						</span>

						<span class=" flex-1 color-black ">{{ item.pay_info }}</span>
						<span class=" flex-1 color-black text-right">{{ item.wDate }}</span>
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
					</div>
					<div class="pa-10 under-line">
						<span class="bg-black pa-5">배송지 정보</span>
						{{ item.d_name }} /
						{{ item.d_tell }} /
						{{ item.d_post }}
						{{ item.d_addr1 }}
						{{ item.d_addr2 }}
					</div>
					<ul>
						<li
							v-for="supply in item.supply_list"
							:key="'item_' + item.uid + 'supply_' + supply.uid"
							class=""
						>
							<table class="mt-10">
								<colgroup>
									<col width="80px" />
									<col width="250px" />
									<col width="180px" />
									<col width="180px" />
									<col width="180px" />
									<col width="200px" />
									<col width="auto" />
								</colgroup>
								<thead>
								<tr>
									<th colspan="2">상품명</th>
									<th>판매가</th>
									<th>공급가</th>
									<th>공급수량</th>
									<th>주문 상태</th>
									<th>관리</th>
								</tr>
								</thead>
								<tbody>
									<tr
										v-for="odt in supply.odt_list"
										:key="'item_' + item.uid + 'supply_' + supply.uid + 'odt_' + odt.uid"
									>
										<td>
											<div
												style="max-width: 60px; max-height: 60px; overflow: hidden"
											>
												<img
													v-if="odt.pdt_img"
													:src="odt.pdt_img"
													style="width: 100%"
												/>
												<v-icon
													v-else
												>mdi mdi-image</v-icon>
											</div>
										</td>
										<td class="text-left">
											<span>상품명: {{ odt.pdt_name }}</span>
											<br/>
											<span class="color-gray mt-5">선택 옵션: {{ odt.op_name }}</span>
										</td>
										<td class="  ">
											판매가: {{ odt.pdt_price | makeComma }} 원
										</td>
										<td class="  ">
											공급가: {{ odt.pdt_purchase | makeComma }} 원
										</td>
										<td class=" ">수량: {{ odt.op_cnt | makeComma }} 개</td>

										<td class=" ">
											<span
												class="pa-5-10"
												:class="'color-' + odt.order_status_color"
											>{{ odt.order_status_name }}</span>
										</td>

										<td class="text-right">
											<button
												v-if="odt.order_status == 'step21'"
												class="bg-red pa-5-10 mr-10"
												@click="isCancel(odt)"
											><span class="vertical-middle">주문 취소</span> <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>

											<button
												v-if="odt.order_status == 'step31'"
												class="bg-gray pa-5-10 vertical-middle mr-10 "
												@click="isReturn(odt)"
											><span class="vertical-middle">내용 확인</span> <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>

											<button
												v-if="odt.order_status == 'step41'"
												class="bg-gray pa-5-10 vertical-middle mr-10 "
												@click="isReturn(odt)"
											><span class="vertical-middle">내용 확인</span> <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>

											<span class="pa-5 box mr-10 vertical-middle">{{ odt.delivery_name ? odt.delivery_name : '택배사' }}</span>

											<span class="pa-5 box vertical-middle">{{ odt.shipping_num ? odt.shipping_num : '송장번호' }}</span>
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<td colspan="2" class="text-left"><span class="bg-black pa-5">공급사 정보</span> {{ supply.seller_id }}</td>
										<td >판매가: {{ supply.total_price | makeComma }} 원</td>
										<td >공급가: {{ supply.total_purchase | makeComma }} 원</td>
										<td >공급 배송비: {{ supply.delivery_price | makeComma }} 원</td>
										<td >공급가 합계: {{ supply.supply_total | makeComma }} 원</td>
										<td ></td>
									</tr>
								</tfoot>
							</table>
						</li>
					</ul>
				</li>
			</ul>
			<div
				v-else
				class="full-height flex-column justify-center"
			>
				<div class="text-center">
					<v-icon
						class="size-px-48 color-icon"
					>mdi mdi-cloud-off-outline</v-icon>
					<br/>
					<br/>
					<div class="font-weight-bold size-px-24">No Data</div>
				</div>
			</div>
		</div>

		<Pagination
			:options="search"
			class="text-center"
		></Pagination>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"
			@close="modalClear"
		>
			<div
				v-if="modal_option.is_reason"
				slot="modal-content"
				v-html="modal_option.content"
				class="text-left"
			></div>
			<div
				slot="modal-bottom"
				class="justify-space-between"
			>
				<button
					class="flex-1 pa-10"
					@click="doAction"
					:class="'bg-' + modal_option.color"
				>확인</button>
				<button
					class="flex-1 pa-10 bg-gray"
					@click="modalClear"
				>취소</button>
			</div>
		</Modal>

	</div>
</template>

<script>

import Pagination from "../../components/Pagination";
import Search from "../Layout/Search";
import Modal from "@/components/Modal";

export default {
	name: 'ManagerAdminList'
	,
	components: {Modal, Search, Pagination},
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
				,page: this.$route.query.page ? this.$route.query.page : 1
				,search_type: this.$route.query.search_type ? this.$route.query.search_type : ''
				,search_value: this.$route.query.search_value ? this.$route.query.search_value : ''
				,list_cnt:  this.$route.query.list_cnt ? this.$route.query.list_cnt : 10
				,o_status: this.$route.query.o_status ? this.$route.query.o_status : ''
				,order_status: this.$route.query.order_status ? this.$route.query.order_status : ''
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
			,is_modal: false
			,modal_option: {
				title: ''
				,top: true
				,content: ''
				,bottom: true
				,width: '360px'
				,color: ''
				,is_reason: false
			}
			,item_cancel: null
			,item_return: null
			,item_change: null
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
			this.$emit('onLoading')
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
			}finally {
				this.$emit('offLoading')
			}
		}
		,getSearch: function(){
			this.$emit('push', { name: this.$route.name, params: this.$route.params, query: this.search})
			this.getData()
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
		,setOdtStatus: async function(odt, next_step){
			this.$emit('onLoading')

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postOdtUpdate'
					,data: {
						ATOKEN: this.TOKEN
						,uid: odt.uid
						,o_status: odt.o_status
						,next_step: next_step
					}
				})

				if(result.success){
					odt.order_status = next_step
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,toExcel: function(){
			this.excel_data.content = this.items
			this.is_excel = true
		}
		,toItem: function (){
			this.is_item = !this.is_item
		}
		,update: async function(item, next_status){
			this.$emit('onLoading')

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postOrderUpdate'
					,data: {
						ATOKEN: this.TOKEN
						,uid: item.uid
						,next_status: next_status
					}
				})

				if(result.success){
					item.o_status = next_status
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,isCancel: function(odt){
			this.item_cancel = odt
			this.is_modal = true
			this.modal_option.title = '주문상품 취소'
			this.modal_option.content = '해당 상품을 주문취소처리 하시겠습니까?'
			this.modal_option.color = 'red'
		}
		,toCancel: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postOdtCancel'
					,data: {
						ATOKEN: this.TOKEN
						,odt_uid: this.item_cancel.uid
					}
				})

				if(result.success){
					await this.getSearch()
					this.$emit('setNotify', { type: 'success', message: result.message})
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.modalClear()
			}
		}
		,doAction: function(){
			if(this.item_cancel){
				this.toCancel()
			}
		}
		,modalClear: function(){
			this.item_cancel = null
			this.item_return = null
			this.item_change = null
			this.is_modal = false
			this.modal_option = {
				title: ''
				,top: true
				,content: ''
				,bottom: true
				,width: '360px'
				,color: ''
				,is_reason: false
			}
		}
		,toSearch: function(){
			this.$router.push({ name: this.$route.name, params: this.$route.params, query: {
					o_status: this.search.o_status
					,order_status: this.search.order_status
					,list_cnt: this.search.list_cnt
					,search_type: this.search_type
					,search_value: this.search_value
				}
			})
		}
		,isReturn: async  function(odt){
			this.is_modal = true

			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getOdtStep'
					,data: {
						ATOKEN: this.TOKEN
						,odt_uid: odt.uid
						,step: odt.order_status
					}
				})

				if(result.success){
					odt.history = result.data
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
					return
				}
			}catch(e){
				console.log(e)
			}

			if(odt.order_status == 'step31'){
				this.item_change = odt
				this.modal_option.title = '교환'
				this.modal_option.content = odt.pdt_name + ' 상품을 교환 처리하시겠습니까?'
				this.modal_option.content += '<br/><br/>사유: ' + odt.history.reason
				this.modal_option.content += '<br/><br/>상세사유: ' + odt.history.reason_text
				this.modal_option.is_reason = true
			}else if(odt.order_status == 'step41'){
				this.item_return = odt
				this.modal_option.title = '반품'
				this.modal_option.content = odt.pdt_name + ' 상품을 반품 처리하시겠습니까?'
				this.modal_option.content += '<br/><br/>사유: ' + odt.history.reason
				this.modal_option.content += '<br/><br/>상세사유: ' + odt.history.reason_text
				this.modal_option.is_reason = true
			}else{
				this.$emit('setNotify', { type: 'error', message: '교환 또는 반품처리 할 수 없는 주문상품입니다'})
				return
			}

			this.modal_option.color = 'red'
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getSearch()
	}
	,watch: {
		items: {
			deep: true
			,handler: function(){
			}
		}
		,'search.page': {
			handler: function(){
				this.getSearch()
			}
		}
	}
}
</script>

<style>
.pdt-img img { width: 100%}
</style>