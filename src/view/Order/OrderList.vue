<template>
	<div
		class="full-height flex-column"
	>
		<div>
			<ul
				class=" justify-space-between "
			>
				<li
					class="flex-1 pa-10 text-center cursor-pointer mr-1"
					:class="search.order_status == '' ? 'bg-green ': 'bg-default'"
					@click="search.order_status = ''; getSearch(1)"
				>주문 전체</li>
				<li
					v-for="order_status in codes.O002.items"
					:key="'order_status' + order_status.total_code"

					class="flex-1 pa-10 text-center cursor-pointer mr-1"
					:class="order_status.code_value == search.order_status ? 'bg-' + order_status.code_color : 'bg-default'"
					@click="search.order_status = order_status.code_value; getSearch(1)"
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

			<label
				slot="first"
			>
				<input
					v-model="search.is_fail"
					type="checkbox"
					@change="getData"
				/> 결제 실패건 포함
			</label>
			<select
				slot="add"
				v-model="search.o_status"
				class="pa-5-10 mr-10"
				@change="getSearch(1)"
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
				@change="getSearch(1)"
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
			class="mt-10  bg-white   full-height overflow-y-auto"
		>
			<ul
				v-if="items.length > 0"
				class=" full-height  "
			>
				<li
					v-for="(item, index) in item_list"
					:key="item.order_num_new"
					class="mb-50 "
				>

					<div
						class="pa-10 justify-space-between "
						:class="'bg-light-' + item.o_status_color"
					>
						<div class=" ">
							<span class="color-black">[{{ item.o_status_name }}]</span>
							<span class="color-black"> {{ item.order_num_new}}</span>
						</div>

						<div class="color-black text-center ml-40">
							총 판매가: <span class="font-weight-bold">{{ item.total_price | makeComma }}</span> 원 /
							총 배송비: <span class="font-weight-bold">{{ item.delivery_price | makeComma }}</span> 원 /
							결제금액: <span class="font-weight-bold">{{ item.order_price | makeComma }}</span> 원
						</div>

						<span class=" flex-1 color-black ">{{ item.pay_info }}</span>
						<span class=" flex-1 color-black text-right">{{ item.wDate }}</span>
					</div>


					<div class=" pa-10 under-line ">

						<template
							v-if="user.role == 'admin'"
						>
							<template
								v-for="o_status in codes.o_status"
							>
								<button
									v-if="o_status.code > 0"
									:key="'o_status_' + o_status.code"
									class=" prl-10 mr-10"
									:class="o_status.code != item.o_status ? 'bg-default' : 'bg-light-' + o_status.color"
									@click="isConfirm(index, item, o_status.code)"
								>
									<span class="vertical-middle color-333 ">{{  o_status.name }}</span>
									<v-icon class="color-333">mdi mdi-chevron-right</v-icon>
								</button>
							</template>
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

					<div class="pa-10 justify-space-between">
						<table
							class="table mr-10 box th-left td-right"
						>
							<col width="120px" />
							<col width="auto" />
							<tbody>
								<tr>
									<th colspan="2" class="text-center">결제 정보</th>
								</tr>
								<tr>
									<th>주문번호</th>
									<td>{{ item.order_num_new}}</td>
								</tr>
								<tr>
									<th>결제방식</th>
									<td>{{ item.pay_div_name }}</td>
								</tr>
								<tr>
									<th>결제 상태</th>
									<td>{{ item.o_status_name}}</td>
								</tr>
								<tr>
									<th>총 상품가</th>
									<td>{{ item.total_price | makeComma }} 원</td>
								</tr>
								<tr>
									<th>총 배송비</th>
									<td>{{ item.delivery_price | makeComma }} 원</td>
								</tr>
								<tr>
									<th>결제금액</th>
									<td>{{ item.order_price | makeComma }}</td>
								</tr>
							</tbody>
						</table>
						<table
							class="table mr-10 box th-left td-right"
						>
							<col width="120px" />
							<col width="auto" />
							<tbody>
								<tr>
									<th colspan="2" class="text-center">주문자 정보</th>
								</tr>
								<tr>
									<th>대리점</th>
									<td>{{ item.agency_name}}</td>
								</tr>
								<tr>
									<th>이름</th>
									<td>{{ item.member_name}}</td>
								</tr>
								<tr>
									<th>아이디</th>
									<td>{{ item.member_id }}</td>
								</tr>
								<tr>
									<th>연락처</th>
									<td>{{ item.member_tell }} </td>
								</tr>
								<tr>
									<th>-</th>
									<td>-</td>
								</tr>
							</tbody>
						</table>

						<table
							class="table mr-10 box th-left td-right"
						>
							<col width="120px" />
							<col width="auto" />
							<tbody>
								<tr>
									<th colspan="2" class="text-center">배송 정보</th>
								</tr>
								<tr>
									<th>배송 구분</th>
									<td
										v-if="item.delivery_type == 'D002002'"
										class="text-center"
									>방문 수령</td>
									<td
										v-else
									>택배 배송</td>
								</tr>
								<tr>
									<th>이름</th>
									<td>{{ item.d_name}}</td>
								</tr>
								<tr>
									<th>연락처</th>
									<td>{{ item.d_tell }} </td>
								</tr>
								<tr>
									<th>주소</th>
									<td>{{ item.d_post }} {{ item.d_addr1 }} </td>
								</tr>
								<tr>
									<th>상세주소</th>
									<td>{{ item.d_addr2 }}</td>
								</tr>
							</tbody>
						</table>

						<table class="table table-even"></table>
					</div>
					<ul>
						<li
							v-for="supply in item.supply_list"
							:key="'item_' + item.uid + 'supply_' + supply.uid"
							class=" pa-10"
						>
							<table class="table table-even">
								<colgroup>
									<col width="120px" />
									<col width="300px" />
									<col width="auto" />
									<col width="auto" />
									<col width="auto" />

									<col width="auto" />
									<col width="auto" />
									<col width="500px" />
								</colgroup>
								<thead>
									<tr>
										<th colspan="2">상품명</th>
										<th>공급가</th>
										<th>판매가</th>
										<th>판매 수량</th>
										<th>소계</th>
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
											공급가: {{ odt.pdt_purchase | makeComma }} 원
										</td>
										<td class="  ">
											판매가: {{ odt.pdt_price | makeComma }} 원
										</td>
										<td class=" ">수량: {{ odt.op_cnt | makeComma }} 개</td>
										<td class=" ">소개: {{ odt.op_cnt * odt.pdt_price | makeComma }} 원</td>

										<td class=" ">
											<span
												class="pa-5-10"
												:class="'bg-' + odt.order_status_color"
											>{{ odt.order_status_name }}</span>
										</td>
										<td>
											<div
												v-if="!item.o_status || item.o_status == 0"
											>
												-
											</div>
											<div
												v-else
												class=" inline position-relative text-right flex-column justify-center"
											>
												<div
													v-if="user.role_group == 'admin' || user.role_group == 'supply' || user.role == 'agency'"
												>
													<template
														v-if="item.delivery_type == 'D002002'"
													>
														<button
															v-if="odt.order_status == 'step1'"
															class="pa-5 mr-10 bg-green vertical-middle"
															@click="onComplete(odt, 'step4')"
														><span class="vertical-middle">판매 완료</span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
														<button
															v-if="odt.is_cancel"
															class="pa-5 mr-10 bg-danger vertical-middle"
															@click="onCancel(odt, 'step22')"
														><span class="vertical-middle">주문 취소</span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
													</template>
													<template
														v-else
													>
														<button
															v-if="odt.order_status == 'step1'"
															class="pa-5 mr-10 bg-blue vertical-middle"
															@click="setOdtStatus(odt, 'step2')"
														><span class="vertical-middle">배송 준비중</span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
														<button
															v-if="odt.order_status == 'step2'"
															class="pa-5 mr-10 bg-blue vertical-middle"
															@click="setOdtStatus(odt, 'step3')"
														><span class="vertical-middle">배송중 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
														<button
															v-if="odt.order_status == 'step3'"
															class="pa-5 mr-10 bg-blue vertical-middle"
															@click="setOdtStatus(odt, 'step4')"
														><span class="vertical-middle">배송완료 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
														<button
															v-if="odt.order_status == 'step4'"
															class="pa-5 mr-10 bg-green vertical-middle"
															@click="setOdtStatus(odt, 'step5')"
														><span class="vertical-middle">구매확정 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
													</template>
													<button
														v-if="odt.order_status == 'step21'"
														class="pa-5 mr-10 bg-red vertical-middle"
														@click="setOdtStatus(odt, 'step22')"
													><span class="vertical-middle">주문 취소 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
													<button
														v-if="odt.order_status == 'step31'"
														class="pa-5 mr-10 bg-gray  vertical-middle"
														@click="isReturn(odt)"
													><span class="vertical-middle">내용 확인 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
													<button
														v-if="odt.order_status == 'step32'"
														class="pa-5 mr-10 bg-gray vertical-middle"
														@click="setOdtStatus(odt, 'step33')"
													><span class="vertical-middle">교환 완료 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
													<button
														v-if="odt.order_status == 'step41'"
														class="pa-5 mr-10 bg-gray vertical-middle"
														@click="isReturn(odt)"
													><span class="vertical-middle">내용 확인 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>
													<button
														v-if="odt.order_status == 'step42'"
														class="pa-5 mr-5 bg-red vertical-middle"
														@click="setOdtStatus(odt, 'step33')"
													><span class="vertical-middle">반품 완료 </span> <v-icon small class="color-eee ">mdi mdi-chevron-right</v-icon></button>

													<select
														v-model="odt.shipping_name"
														class="box pa-5 vertical-middle mr-5"
														:disabled="odt.not_confirm"
													>
														<option
															:value="null"
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
														v-if="false"
														class="btn-success pa-5 vertical-middle"
														:disabled="odt.not_confirm"
														@click="setShipping(odt)"
													>등록</button>
												</div>
												<div
													v-else
												>
													<span class="pa-5-10" :class="'bg-' + odt.order_status_color">{{ odt.order_status_name }}</span>
													{{ odt.shipping_num}}
													{{ odt.shipping_name }}
												</div>
											</div>
										</td>
									</tr>

									<tr class="top-line">
										<th>공급사 정보</th>
										<td class="text-left"> {{ supply.seller_id }}</td>
										<td class="text-center">총 공급가: {{ supply.total_purchase | makeComma }} 원</td>
										<td class="text-center">총 판매가: {{ supply.total_price | makeComma }} 원</td>
										<td >총 수량: {{ supply.total_count | makeComma }} 개</td>
										<td >합계 : {{ supply.total_sum | makeComma }} 개</td>
										<td class="text-center">배송비: {{ supply.delivery_total | makeComma }} 원</td>
										<td class="text-center">공급가 합계: {{ supply.supply_total | makeComma }} 원</td>
									</tr>
								</tbody>
							</table>
						</li>
					</ul>
				</li>
			</ul>
			<div
				v-else
				class="pa-10 bg-white full-height"
			>
			<Empty

			></Empty>
			</div>
		</div>

		<Pagination
			:program="program"
			:align="'center'"
			:options="search"

			@click="getSearch"
		></Pagination>

		<Excel
			v-if="is_excel"
			:excel_data="excel_data"
			:date="date"

			@close="is_excel = false"
		></Excel>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"
			@close="modalClear"
			@click="doAction"
			@cancel="modalClear"
		>
			<div
				v-if="modal_option.is_reason"
				slot="modal-content"
				v-html="modal_option.content"
				class="text-left"
			></div>
		</Modal>

	</div>
</template>

<script>

import Pagination from "../../components/Pagination";
import Search from "../Layout/Search";
import Excel from "../../components/Excel";
import Modal from "@/components/Modal";
import Empty from "@/view/Layout/Empty";

export default {
	name: 'ManagerAdminList'
	,
	components: {Empty, Modal, Excel, Search, Pagination},
	props: ['Axios', 'TOKEN', 'codes', 'rules', 'user', 'date']
	,data: function (){
		return {
			program: {
				name: '주문 목록'
				,top: true
				,title: true
			}
			,options: {

			}
			,search: this.$storage.init({
				ATOKEN: this.TOKEN
				, page: 1
				, search_type: ''
				, search_value: ''
				, list_cnt: 10
				, o_status: ''
				, order_status: ''
				, sDate: this.date.getLastDate(7, '-')
				, eDate: this.date.getToday('-')
				, is_fail: false
			})
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
			}
			,tCnt: 0
			,is_excel: false
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

			return this.items.filter((item) => {
				let o_status = this.codes.o_status[Number(item.o_status)]

				if(o_status) {
					item.o_status_name = o_status.name
					item.o_status_color = o_status.color
				}

				let pay_div = this.codes.pay_div[item.pay_div]
				item.pay_div_name = pay_div.name

				item.supply_list.filter((supply) => {

					supply.total_count = 0
					supply.total_sum = 0
					supply.odt_list.filter((odt) => {
						if(odt.pdt_img1){
							odt.pdt_img = this.$pdt_img_url + odt.pdt_img1
						}else{
							odt.pdt_img = ''
						}

						let order_status = this.codes.odt_status[odt.order_status]

						if(order_status){
							odt.order_status_color = order_status.color
						}
						odt.step_group = odt.order_status.slice(-2, -1)

						odt.ATOKEN = this.TOKEN

						if(item.o_status != 2 || odt.order_status == 'step5' || item.delivery_type == 'D002002'){
							this.$set(odt, 'not_confirm', true)
						}

						if(odt.order_status == 'step1' || odt.order_status == 'step2' || odt.order_status == 'step3' || odt.order_status == 'step4'){
							this.$set(odt, 'is_cancel', true)
						}

						supply.total_count += Number(odt.op_cnt)
						supply.total_sum += Number(odt.op_cnt) * Number(odt.pdt_price)
					})

					supply.supply_total = (Number(supply.total_purchase) + Number(supply.delivery_total))

				})

				item.ATOKEN = this.TOKEN

				return item
			})

		}

		,excel_data: function(){

			let list = []

			this.items.filter(function(item){

				item.supply_list.filter(function(supply){

					supply.odt_list.filter(function(odt){

						list.push({
							order_number: item.order_number + ' '
							, order_num_new: '[' + item.order_num_new + ']'
							, agency_name: item.agency_name
							, member_id: item.member_id
							, member_name: item.member_name
							, order_status_name: odt.order_status_name
							, odt_price: odt.pdt_price
							, odt_name: odt.pdt_name
							, op_name: odt.op_name
							, odt_cnt: odt.op_cnt
							, odt_total: Number(odt.op_cnt) * Number(odt.pdt_price)
							, delivery_type: item.delivery_type == 'D002002' ? '방문수령' : '택배배송'
							, d_name: item.d_name
							, d_post: item.d_post
							, d_addr1: item.d_addr1
							, d_addr2: item.d_addr2
						})
					})
				})
			})

			console.log('excel', list)

			return {
				name: '주문 목록'
				, header: [
					{key: 0, name: '대리점', column: 'agency_name'}
					, {key: 0, name: '주문번호', column: 'order_num_new'}
					, {key: 0, name: '주문코드', column: 'order_number'}
					, {key: 0, name: '아이디', column: 'member_id'}
					, {key: 0, name: '이름', column: 'member_name'}
					, {key: 0, name: '주문 상품', column: 'odt_name'}
					, {key: 0, name: '상품 옵션', column: 'op_name'}
					, {key: 0, name: '상품 금액', column: 'odt_price'}
					, {key: 0, name: '주문 수량', column: 'odt_cnt'}
					, {key: 0, name: '합계', column: 'odt_total'}
					, {key: 0, name: '주문 상태', column: 'order_status_name'}
					, {key: 0, name: '배송구분', column: 'delivery_type'}
					, {key: 0, name: '받는분', column: 'd_name'}
					, {key: 0, name: '우편번호', column: 'd_post'}
					, {key: 0, name: '주소', column: 'd_addr1'}
					, {key: 0, name: '상세주소', column: 'd_addr2'}
					, {key: 0, name: '택배사', column: 'shipping_name'}
					, {key: 0, name: '운송장번호', column: 'shipping_num'}
				]
				, content: list
			}
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
					this.$storage.setQuery(this.search)
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,getSearch: function(page){

			if(page){
				this.search.page = page
			}
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
						, next_step: odt.next_step
						, shipping_name: odt.shipping_name
						, shipping_num: odt.shipping_num
					}
				})

				if(result.success){
					await this.getData()
					this.$set(odt, 'order_status', odt.next_step)
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
			//this.excel_data.content = this.items
			this.is_excel = true
		}
		,toItem: function (){
			this.is_item = !this.is_item
		}
		,update: async function(index, item, o_status){
			this.$bus.$emit('on', true)
			item.next_status = o_status
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postOrderUpdate'
					,data: item
				})

				if(result.success){
					await this.getData()
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
		,isCancel: function(odt){
			this.item_cancel = odt
			this.is_modal = true
			this.modal_option.title = '주문상품 취소'
			this.modal_option.content = '해당 상품을 주문취소처리 하시겠습니까?'
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
		,isConfirm: function(index, item, code){
			if(item.delivery_type == 'D002002'){
				this.$bus.$emit('notify', {type: 'error', message: '카드결제 주문은 처리할수 없습니다. 상품별 주문상태를 변경하세요'})
			}else{
				if(confirm("해당 주문건의 결제상태를 변경하시겠습니까?")){
					this.update(index, item, code)
				}
			}
		}
		, onComplete: function(odt, step){
			if(confirm("방문수령 판매 완료처리하시겠습니까?")){
				this.setOdtStatus(odt, step)
			}
		}
		, onCancel: function(odt, step){
			if(confirm("카드결제인 경우 해당 PG사에서 실결제 취소 후 진행하셔야 합니다. 주문 취소 처리 하시겠습니까?")){
				this.setOdtStatus(odt, step)
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
	,watch: {

	}
}
</script>

<style>
.pdt-img img { width: 100%}
</style>