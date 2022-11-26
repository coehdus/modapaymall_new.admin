<template>
	<div
		class="full-height flex-column"
	>
		<div>
			<ul
				class=" justify-space-between"
			>
				<li
					class="flex-1 pa-10 box text-center "
					:class="{'bg-bbb color-333': search.order_status == ''}"
					@click="search.order_status = ''; getSearch()"
				>주문 전체</li>
				<li
					v-for="order_status in codes.O002.items"
					:key="'order_status' + order_status.total_code"

					class="flex-1 pa-10 box text-center "
					:class="{'bg-bbb color-333': order_status.code_value == search.order_status}"
					@click="search.order_status = order_status.code_value; getSearch()"
				>{{ order_status.code_name }}</li>
			</ul>
		</div>
		<Search
			:search="search"
			:option="search_option"

			@change="getSearch"
			@click="getSearch"
			@toExcel="toExcel"
			@toItem="toItem"

			class="mt-10"
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
					class=" mb-50 bg-base"
				>
					<div
						class="pa-10 justify-space-between color-black"
						:class="'bg-light-' + item.o_status_color"
					>
						<div class=" ">
							<span class="color-black">[{{ item.o_status_name }}]</span>
							<span class="color-black"> {{ item.order_num_new}}</span>
						</div>

						<span class="flex-1  color-black ml-40">
							총 공급가: {{ item.total_purchase | makeComma }} 원 /
							총 배송비: {{ item.delivery_price | makeComma }} 원
						</span>
						<span class=" flex-1 color-black text-right">{{ item.wDate }}</span>
					</div>
					<div class="pa-13-10 under-line">

						<template
							v-for="o_status in codes.o_status"
						>
							<span
								v-if="o_status.code > 0"
								:key="'o_status_' + o_status.code"
								class="pa-5-10 mr-10"
								:class="o_status.code != item.o_status ? 'bg-gray' : 'bg-light-' + o_status.color"
							>
								<span class="color-333 ">{{  o_status.name }}</span>
							</span>
						</template>

						<div v-if="false">
							<button
								v-if="item.o_status == '1'"
								class=" bg-green prl-10 "
							><span class="vertical-middle color-ddd ">입금 확인</span> <v-icon class="color-ddd">mdi mdi-chevron-right</v-icon></button>
							<button
								v-else-if="item.o_status == '2' || item.o_status == '3'"
								class="bg-light-red prl-10 "
							><span class="vertical-middle color-eee">주문 취소</span> <v-icon class="color-eee">mdi mdi-chevron-right</v-icon></button>
						</div>
					</div>
					<div class="justify-space-between under-line ">
						<div
							class="pa-10"
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

					<div class="justify-space-between under-line ">
						<div
							class="pa-10"
						>
							<span class="bg-black pa-5">대리점 정보</span>
							{{ item.shop_name }}
						</div>
					</div>
					<table class="mt-10">
						<colgroup>
							<col width="80px" />
							<col width="250px" />
							<col width="180px" />
							<col width="180px" />
							<col width="200px" />
							<col width="auto" />
						</colgroup>
						<thead>
						<tr>
							<th colspan="2">상품명</th>
							<th>공급가</th>
							<th>공급수량</th>
							<th>주문 상태</th>
							<th>관리</th>
						</tr>
						</thead>
						<tbody>
						<tr
							v-for="odt in item.odt_list"
							:key="'odt_' + odt.uid"
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
								<div>

									<button
										v-if="odt.order_status == 'step1'"
										class="pa-5 mr-10 bg-blue vertical-middle"
										@click="setOdtStatus(odt, 'step2')"
									><span class="vertical-middle">배송 중비중</span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
									<button
										v-else-if="odt.order_status == 'step2'"
										class="pa-5 mr-10 bg-blue vertical-middle"
										@click="setOdtStatus(odt, 'step3')"
									><span class="vertical-middle">배송중 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
									<button
										v-else-if="odt.order_status == 'step3'"
										class="pa-5 mr-10 bg-blue vertical-middle"
										@click="setOdtStatus(odt, 'step4')"
									><span class="vertical-middle">배송완료 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
									<button
										v-else-if="odt.order_status == 'step21'"
										class="pa-5 mr-10 bg-red vertical-middle"
										@click="setOdtStatus(odt, 'step22')"
									><span class="vertical-middle">주문 취소 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
									<button
										v-else-if="odt.order_status == 'step31'"
										class="pa-5 mr-10 bg-gray  vertical-middle"
										@click="isReturn(odt)"
									><span class="vertical-middle">내용 확인 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
									<button
										v-else-if="odt.order_status == 'step32'"
										class="pa-5 mr-10 bg-gray vertical-middle"
										@click="setOdtStatus(odt, 'step33')"
									><span class="vertical-middle">교환 완료 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
									<button
										v-else-if="odt.order_status == 'step41'"
										class="pa-5 mr-10 bg-gray vertical-middle"
										@click="isReturn(odt)"
									><span class="vertical-middle">내용 확인 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
									<button
										v-else-if="odt.order_status == 'step42'"
										class="pa-5 mr-5 bg-red vertical-middle"
										@click="setOdtStatus(odt, 'step33')"
									><span class="vertical-middle">반품 완료 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>

									<select
										v-model="odt.shipping_name"
										class="box pa-5 vertical-middle mr-10"
										:disabled="odt.not_confirm"
									>
										<option
											value=""
										>택배사 선택</option>
										<option
											v-for="(v, index) in codes.G000.items"
											:key="'parcel_' + index"
											:value="v.total_code"
										>{{ v.code_name }}</option>
									</select>

									<input
										v-model="odt.shipping_num"
										class="box pa-5 vertical-middle mr-5"
										placeholder="송장번호"
										:disabled="odt.not_confirm"
									/>
									<button
										class="btn-success pa-5-10 vertical-middle"
										:disabled="odt.not_confirm"
										@click="setShipping(odt)"
									><span class="vertical-middle">등록</span><v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>
								</div>
							</td>
						</tr>
						</tbody>
					</table>
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
			:options="options"
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
import Search from "@/view/Layout/Search";
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
				,is_item: false
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
			,is_excel: false
			,excel_data: {
				name: '주문 목록'
				,header: [
					{ key: 0, name: '주문번호', column: 'order_num_new'}
					,{ key: 0, name: '아이디', column: 'member_id'}
					,{ key: 0, name: '이름', column: 'member_name'}
					,{ key: 0, name: '결제금액', column: 'order_price'}
					,{ key: 0, name: '총 상품금액', column: 'total_price'}
					,{ key: 0, name: '배송비', column: 'delivery_price'}
					,{ key: 0, name: '받는분', column: 'delivery_price'}
					,{ key: 0, name: '우편번호', column: 'd_post'}
					,{ key: 0, name: '주소', column: 'd_addr1'}
					,{ key: 0, name: '상세주소', column: 'd_addr2'}
				]
				,content: null
			}
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

				item.odt_list.filter(function(odt){
					if(odt.pdt_img1){
						odt.pdt_img = self.codes.img_url + odt.pdt_img1
					}else{
						odt.pdt_img = ''
					}

					odt.step_group = odt.order_status.slice(-2, -1)

					odt.ATOKEN = self.TOKEN

					if(!odt.shipping_name){
						odt.shipping_name = ''
					}
``
					if(item.o_status != 2 || odt.order_status == 'step4' || odt.order_status == 'step5' || odt.order_status == 'step33'|| odt.order_status == 'step43'){
						odt.not_confirm = true
					}

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
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
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
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
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
		,setShipping: async function(odt){
			this.$bus.$emit('on', true)
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postOdtShipping'
					,data: {
						ATOKEN: odt.ATOKEN
						,odt_uid: odt.uid
						,shipping_num: odt.shipping_num
						,shipping_name: odt.shipping_name
					}
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,setOdtStatus: async function(odt, step){
			this.$bus.$emit('on', true)
			odt.next_step = step
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postOdtUpdate'
					,data: {
						ATOKEN: this.TOKEN
						, uid: odt.uid
						, order_status: odt.order_status
						, next_step: odt.next_step
						, shipping_name: odt.shipping_name
						, shipping_num: odt.shipping_num
					}
				})

				if(result.success){
					await this.getSearch()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,toExcel: function(){
			this.excel_data.content = this.items
			this.is_excel = true
		}
		,toItem: function (){
			this.is_item = !this.is_item
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
				const result = await this.$request.init({
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
					this.$bus.$emit('notify', { type: 'error', message: result.message})
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
				this.$bus.$emit('notify', { type: 'error', message: '교환 또는 반품처리 할 수 없는 주문상품입니다'})
				return
			}

			this.modal_option.color = 'red'
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
		,doAction: function(){
			if(this.item_cancel){
				this.toCancel()
			}else if(this.item_return){
				this.toReturn()
			}else if(this.item_change){
				this.toChange()
			}
		}
		,toCancel: async function(){
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postOdtCancel'
					,data: {
						ATOKEN: this.TOKEN
						,odt_uid: this.item_cancel.uid
					}
				})

				if(result.success){
					await this.getSearch()
					this.$bus.$emit('notify', { type: 'success', message: result.message})
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.modalClear()
			}
		}
		,toReturn: async function(){
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postOdtReturn'
					,data: {
						ATOKEN: this.TOKEN
						,odt_uid: this.item_return.uid
					}
				})

				if(result.success){
					await this.getSearch()
					this.$bus.$emit('notify', { type: 'success', message: result.message})
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.modalClear()
			}
		}
		,toChange: async function(){
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postOdtChange'
					,data: {
						ATOKEN: this.TOKEN
						,odt_uid: this.item_change.uid
					}
				})

				if(result.success){
					await this.getSearch()
					this.$bus.$emit('notify', { type: 'success', message: result.message})
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.modalClear()
			}
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
	}
}
</script>

<style>
.pdt-img img { width: 100%}
</style>