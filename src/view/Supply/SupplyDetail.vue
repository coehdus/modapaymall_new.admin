<template>
	<div class="full-height">
		<div
			class="full-height"
		>
			<div
				class="justify-space-between"
			>
				<div class="flex-1 bg-white pa-10 mr-10">
					<h6 class="under-line-identify">계정정보</h6>
					<table class="table th-left td-left">
						<col width="120px">
						<col width="auto">
						<col width="120px">
						<col width="auto">
						<tbody>
						<tr>
							<th>아이디</th>
							<td>
								{{ item.seller_id }}
							</td>
							<th>비밀번호</th>
							<td class="">
								<button
									class="bg-identify pa-5-10"
									@click="isPassword"
								>비밀번호 초기화</button>
							</td>
						</tr>
						<tr>
							<th>이름 <span class="color-red">*</span></th>
							<td>
								<input
									type="text"
									v-model="item.account_name"
									maxlength="20"
									class="input-box full-width"
									placeholder="이름을 입력하세요"
								/>
							</td>
							<th>휴대폰 번호</th>
							<td>
								<input
									type="number"
									v-model="item.account_phone_number"
									:ruels="[rules.max(item, 'admin_phone', 12)]"
									class="input-box full-width"
									placeholder="휴대폰번호를 입력하세요"
								/>
							</td>
						</tr>
						<tr>
							<th>가입일</th>
							<td class="position-relative">
								<input
									v-model="item.join_date"
									class="input-box full-width"
									placeholder="가입일을 선택하세요"
									readonly
									@click="is_data_pick = !is_data_pick"
								/>
								<v-date-picker
									v-if="is_data_pick"
									v-model="item.join_date"
									no-title
									scrollable
									class="position-absolute box"
									style="top: 45px; left: -5px"
									@change="is_data_pick = false"
								></v-date-picker>
							</td>

							<th>계정 상태</th>
							<td class="">
								<button
									v-for="(code, index) in codes.S003.items"
									:key="code.total_code + index"

									class="pa-5-10 mr-1"
									:class="item.account_status == code.code_value ? 'bg-' + code.code_color: 'bg-default'"
									@click="item.account_status = code.code_value "
								>{{ code.code_name }}</button>
							</td>
						</tr>
						</tbody>
					</table>

					<h6 class="under-line-identify mt-10">상점 정보</h6>
					<table class="table th-left td-left">
						<col width="120px">
						<col width="auto">
						<col width="120px">
						<col width="auto">
						<tbody>
						<tr>
							<th>사업자 구분 <span class="color-red">*</span></th>
							<td colspan="3">
								<button
									v-for="code in codes.B002.items"
									:key="code.total_code"

									class="pa-5-10"
									:class="item.business_type == code.total_code ? 'bg-green' : 'bg-default'"

									@click="item.business_type = code.total_code"
								>{{ code.code_name }}</button>
							</td>
						</tr>
						<tr
							v-if="item.business_type == 'B002002'"
						>
							<th>사업자등록번호 <span class="color-red">*</span></th>
							<td colspan="3">
								<input
									type="number"
									v-model="item.front"
									:ruels="[rules.max(item, 'front', 10)]"
									class="input-box"
									placeholder="사업자 등록 번호"
								/>
							</td>
						</tr>
						<tr
							v-if="item.business_type == 'B002001'"
						>
							<th>사업자등록번호 <span class="color-red">*</span></th>
							<td>
								<input
									type="number"
									v-model="item.front"
									:ruels="[rules.max(item, 'front', 10)]"
									class="input-box"
									placeholder="사업자 등록 번호"
								/>
							</td>
							<th>법인등록번호 <span class="color-red">*</span></th>
							<td>
								<input
									type="number"
									v-model="item.back"
									:ruels="[rules.max(item, 'back', 13)]"
									class="input-box"
									placeholder="법인 등록 번호"
								/>
							</td>
						</tr>
						<tr
							v-if="item.business_type == 'B002003'"
						>
							<th>주민등록 번호 <span class="color-red">*</span></th>
							<td colspan="3">
								<input
									v-model="item.front"
									type="number"
									:ruels="[rules.max(item, 'front', 6)]"
									class="input-box-inline mr-10"
									placeholder="주민등록 앞번호"
								/>
								<input
									v-model="item.back"
									type="password"
									maxlength="7"
									class="input-box-inline"
									placeholder="주민등록 뒷번호"
								/>
							</td>
						</tr>

						<tr>
							<th>상점명 <span class="color-red">*</span></th>
							<td>
								<input
									type="text"
									v-model="item.shop_name"
									maxlength="50"
									class="input-box full-width"
									placeholder="상점명을 입력하세요"
								/>
							</td>
							<th>대표자명 <span class="color-red">*</span></th>
							<td>
								<input
									type="text"
									v-model="item.shop_ceo"
									maxlength="10"
									class="input-box full-width"
									placeholder="대표자명을 입력하세요"
								/>
							</td>
						</tr>
						<tr>
							<th>사업장 주소 <span class="color-red">*</span></th>
							<td colspan="3">

								<input
									v-model="item.shop_zip_code"

									class="input-box-inline mr-10"
									type="text" placeholder="우편번호"
									readonly

									@click="daumPost('company')"
								>

								<button
									class="pa-5-10 bg-identify"
									@click="daumPost('company')"
								>주소 검색</button>

								<input
									v-model="item.shop_address"

									class="input-box full-width mt-10" type="text" placeholder="주소"
									readonly

									@click="daumPost('company')"
								>
								<input
									v-model="item.shop_address_detail"

									class="input-box full-width mt-10" type="text" placeholder="상세주소를 입력하세요."
									maxlength="50"
								>
							</td>
						</tr>
						</tbody>
					</table>


					<h6 class="mt-10">정산 정보</h6>
					<table class="table th-left td-left">

						<col width="120px">
						<col width="auto">
						<col width="120px">
						<col width="auto">
						<tbody>
						<tr>
							<th>서비스 수수료 <span class="color-red">*</span></th>
							<td>
								<div
									class="justify-start">
									<div class="flex-1 text-left">
										판매 수수료
										<input
											v-model="item.sales_fee"
											type="number"
											:rules="[rules.demical(item, 'sales_fee', { min:2, max: 2})]"
											class="box pa-5-10 width-fee "
										/> %
									</div>
								</div>
							</td>
							<th>정산주기</th>
							<td class="text-left">영업일 기준 / 월 정산</td>
						</tr>
						<tr>
							<th>은행</th>
							<td>
								<select
									v-model="item.bank_code"
									class="input-box"
								>
									<option :value="''">은행을 선택하세요</option>
									<option
										v-for="code in codes.B001.items"
										:key="code.total_code"
										:value="code.total_code"
									>{{ code.code_name}}</option>
								</select>
							</td>
							<th>계좌번호</th>
							<td>
								<input
									v-model="item.bank_account"
									type="number"
									class="input-box full-width"
									:rules="[rules.max(item, 'bank_name', 25)]"
									placeholder="정산 계좌 번호"
								/>
							</td>
						</tr>
						<tr>
							<th>예금주</th>
							<td>
								<input
									v-model="item.bank_holder"
									class="input-box full-width"
									placeholder="정산 계좌 예금주"
									maxlength="15"
								/>
							</td>
							<th>이메일</th>
							<td>
								<input
									v-model="item.bank_email"
									type="email"
									class="input-box full-width"
									placeholder="세금계산서 발행 이메일"
									maxlength="50"
								/>
							</td>
						</tr>
						</tbody>
					</table>
				</div>

				<div class="flex-1 bg-white pa-10">

					<h6 class="under-line-identify">판매 정보</h6>
					<table class="table th-left td-left">
						<col width="120px">
						<col width="auto">
						<tbody>
						<tr>
							<th>판매여부</th>
							<td>
								<button
									v-for="(code, index) in codes.S004.items"
									:key="code.total_code + '_' + index"
									class="pa-5-10"
									:class="item.shop_status == code.code_value ? 'bg-' + code.code_color : 'bg-default'"
									@click="item.shop_status = code.code_value"
								>{{ code.code_name }}</button>
							</td>
						</tr>
						<tr>
							<th>배송비 구분</th>
							<td>
								<button
									v-for="(code, index) in codes.D001.items"
									:key="code.total_code + index"
									class="pa-5-10"
									:class="item.delivery_type == code.code_value ? 'bg-green' : 'bg-default'"
									@click="item.delivery_type = code.code_value"
								>{{ code.code_name }}</button>
							</td>
						</tr>
						<tr>
							<th>배송비</th>
							<td class="form-inline">
								<input
									v-model="item.delivery_price"
									class="box pa-5-10"
									type="number"
									placeholder="배송비"
									:rules="[rules.max(item, 'delivery_price', 10)]"
								/> 원 <br/>

								<input
									v-model="item.delivery_free_price"
									class="box pa-5-10 mt-10"
									type="number"
									placeholder="무료 금액"
									:rules="[rules.max(item, 'delivery_free_price', 10)]"
								/> 원 이상 구매시 배송비 무료
							</td>
						</tr>
						<tr>
							<th>추가 배송비</th>
							<td>

								<input
									v-model="item.delivery_add_price"
									class="box pa-5-10"
									type="number"
									placeholder="제주/도서/산간 추가 배송비"
									:rules="[rules.max(item, 'delivery_add_price', 10)]"
								/> 원

								<button
									class="bg-identify pa-5-10 float-right"
								>제주도/도서/산간 지역 목록</button>

							</td>
						</tr>
						<tr>
							<th>교환 / 반품 안내</th>
							<td>
								<editor
									v-if="item.shop_return"
									:initialValue="item.shop_return"
									height="420px"
									initialEditType="wysiwyg"
									ref="shop_return"
									class="text-left"
								/>
								<editor
									v-else
									height="420px"
									initialEditType="wysiwyg"
									ref="shop_return"
									class="text-left"
								/>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div
			class="justify-center"
		>
			<button
				class="bg-identify pa-10-20 mr-10"
				@click="save"
			>저장</button>
			<button
				class="box pa-10-20"
				@click="toList"
			>목록</button>
		</div>
		<DaumPost
			:overlay="is_post"
			:config="daum_config"
			@callBack="addPost"
		></DaumPost>

		<Modal
			:is_modal="is_modal"
			:option="{}"
			:top="true"
			:bottom="true"

			title="비밀번호 초기화"
			content="비밀번호를 초기화 하시겠습니까?"
			width="360px"

			content_class="ptb-50"

			@click="doPassword"
			@close="clear"
			@cancel="clear"
		></Modal>
	</div>
</template>

<script>

import DaumPost from "@/components/Daum/DaumPost";
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import Modal from "@/components/Modal";

export default {
	name: 'SupplyDetail'
	, components: {DaumPost, Editor, Modal}
	, props: ['Axios', 'user', 'codes', 'rules', 'date']
	, data: function(){
		return {
			program: {
				name: '공급사 상세정보'
				, top: true
				, title: true
				, bottom: false
			}
			,item: {
				supply_type: ''
				,business_type: 'B002001'
				,bank_code: ''
				,join_date: this.date.getToday('-')
				,delivery_type: '0'
				,shop_return: ''
			}
			,is_data_pick: false
			,is_modal: false
			,is_post: false
			,daum_config: {
				width: '360px'
			}
		}
	}
	,computed: {

	}
	, methods: {
		getData: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getSupply'
					,data: {
						supply_uid: this.$route.params.idx
					}
				})
				if(result.success){
					this.item = result.data
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		, save: async function(){
			try{

				this.$emit('onLoading')

				let shop_return = this.$refs.shop_return.invoke("getMarkdown")

				if(!shop_return){
					this.$refs.shop_return.invoke("setMarkdown", this.item.shop_return)
				}

				this.item.shop_return = shop_return

				const result = await this.Axios({
					method: 'post'
					,url: 'management/putSupply'
					,data: this.item
				})
				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message})
					await this.getData()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,toList: function(){
			this.$storage.push({ name: 'SupplyList'})
		}

		,daumPost: function () {
			this.is_post = true
		}
		, addPost: function (call) {

			this.$set(this.item, 'shop_zip_code', call.zonecode)
			this.$set(this.item, 'shop_address', call.address)

			this.is_post = false
		}
		,clear: function(){
			this.is_modal = false
		}
		,isPassword: function(){
			this.clear()
			this.is_modal = true
		}
		,doPassword: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postSupplyPasswordReset'
					,data: {
						uid: this.$route.params.idx
					}
				})
				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message})
					this.clear()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
	}
	, created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>

<style>
.width-fee { width: 60px !important; text-align: right;}
.v-btn__content { color: #333 !important;}
</style>
