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
							<th>영업단 구분 <span class="color-red">*</span></th>
							<td>{{ item.agency_type_name }}</td>
							<th>소속 영업점</th>
							<td>
								<template
									v-if="user.role_group == 'admin'"
								>
									<template
										v-if="item.agency_type === codes.A001.items[2].total_code"
									>
									<select
										v-if="items_upper.length > 0"
										v-model="item.agency_upper"

										class="input-box"
										@change="getPgList"
									>
										<option value="">선택하세요</option>
										<option
											v-for="(upper, index) in items_upper"
											:key="upper.uid + '_' + index"
											:value="upper.uid"
										>{{ upper.agency_name }}</option>
									</select>
									<template
										v-else
									>영업단 구분을 선택하세요</template>
									</template>
									<template
										v-else
									>{{ item.agency_upper_name }}</template>
								</template>
								<template
									v-else
								>{{ user.shop_name }}</template>
							</td>
						</tr>
						<tr>
							<th>아이디</th>
							<td>{{ item.agency_id }}</td>
							<th>비밀번호</th>
							<td class="text-right">
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
									maxlength="25"
									class="input-box full-width"
									placeholder="이름을 입력하세요"
								/>
							</td>
							<th>휴대폰 번호</th>
							<td>
								<input
									type="number"
									v-model="item.account_phone_number"
									:ruels="[rules.max(item, 'account_phone_number', 12)]"
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
									:key="code.total_code + '_' + index"

									class="pa-5-10 mr-1"
									:class="item.account_status == code.code_value ? 'bg-' + code.code_color: 'bg-default'"
									@click="item.account_status = code.code_value "
								>{{ code.code_name }}</button>
							</td>
						</tr>
						</tbody>
					</table>

					<div class="mt-10">
						<h6>공급가 마진</h6>
						<table
							class="table"
						>
							<thead>
							<tr>
								<th>PG 명</th>
								<th
									v-if="user.role == 'admin'"
								>PG 원가</th>
								<th>마진율</th>
								<th>공급가</th>
								<th>적용여부</th>
							</tr>
							</thead>
							<tbody>
							<tr
								v-for="(pg, index) in pg_sales_list"
								:key="'pg_' + index"
							>
								<td>{{ pg.pg_name }}</td>
								<td
									v-if="user.role == 'admin'"
								>{{ pg.pg_fee }}%</td>
								<td>
									<input
										v-model="pg.fee_rate"
										type="number"
										:rules="[rules.demical(pg, 'fee_rate', { min: 2, max: 2})]"
										class="box pa-5-10 width-fee "
									/> %
								</td>
								<td>
									<input
										v-model="pg.total_rate"
										class="box pa-5-10 width-fee "
										type="number"
										disabled
									/> %
								</td>
								<td
									v-if="item.agency_type == 'A001002'"
								>
									<v-icon
										class="pa-5 "
										:class="pg.fee_status == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="pg.fee_status = 1"
									>mdi mdi-power-plug</v-icon>
									<v-icon
										class="pa-5 "
										:class="pg.fee_status != 1 ? 'bg-red color-white' : 'btn-default' "
										@click="pg.fee_status = 0"
									>mdi mdi-power-plug-off</v-icon>
								</td>
								<td
									v-else
								>
									<v-icon
										class="pa-5 "
										:class="pg.fee_status == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="setFeeStatus(pg, true)"
									>mdi mdi-power-plug</v-icon>
									<v-icon
										class="pa-5 "
										:class="pg.fee_status != 1 ? 'bg-red color-white' : 'btn-default' "
										@click="setFeeStatus(pg, false)"
									>mdi mdi-power-plug-off</v-icon>
								</td>
							</tr>
							<tr>
								<td>무통장 입금</td>
								<td
									v-if="user.role == 'admin'"
								>-</td>
								<td>
									<input
										v-model="item.sales_fee_bank"
										type="number"
										:rules="[rules.demical(item, 'sales_fee_bank', { min: 2, max: 2})]"
										class="box pa-5-10 width-fee "
									/> %
								</td>
								<td>
									<input
										class="box pa-5-10 width-fee "
										type="number"
										:value="text_upper_sales_fee_bank | toFixed(2)"
										disabled
									/> %
								</td>
								<td>-</td>
							</tr>
							</tbody>
						</table>
					</div>

					<div class="mt-10">
						<h6>정산 정보</h6>
						<table class="table th-left td-left">

							<col width="120px">
							<col width="auto">
							<col width="120px">
							<col width="auto">
							<tbody>
							<tr>
								<th>정산주기</th>
								<td class="text-left" colspan="3">영업일 기준 / 월 정산</td>
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
										:rules="[rules.max(item, 'bank_account', 25)]"
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
				</div>

				<div class="flex-1 bg-white pa-10">
					<h6 class="under-line-identify">상점 정보</h6>
					<table class="table th-left td-left">
						<col width="120px">
						<col width="auto">
						<col width="120px">
						<col width="auto">
						<tbody>

						<tr>
							<th>상점 상태</th>
							<td colspan="3">
								<button
									v-for="(code, index) in codes.S004.items"
									:key="code.total_code + '_' + index"

									class="pa-5-10 mr-1"
									:class="item.sales_status == code.code_value ? 'bg-' + code.code_color: 'bg-default'"
									@click="item.sales_status = code.code_value "
								>{{ code.code_name }}</button>
							</td>
						</tr>
						<tr>
							<th>상점명 <span class="color-red">*</span></th>
							<td colspan="3">
								<input
									type="text"
									v-model="item.shop_name"
									maxlength="25"
									class="input-box-inline"
									placeholder="상점명을 입력하세요"
								/>
							</td>
						</tr>
						<tr
							v-if="item.agency_type == 'A001003'"
						>
							<th>상점 로고 <br/> 150 x 100</th>
							<td colspan="3">
								<div>
									<label
										class="box pa-10 justify-space-between"
									>
										{{ logo_img_name }}
										<v-icon
											class="color-icon"
										>mdi mdi-image</v-icon>

										<input_file
											v-show="false"
											accept="image/*" @change="setFile2"
										/>
									</label>
								</div>

								<div
									v-if="item_upload_logo_img.src"
									class="flex-row mt-10"
								>
									<div
										class="flex-1" style="position: relative"
									>
										<img
											:src="item_upload_logo_img.src"
										/>
										<button class="item_close" style="background-color: black">
											<v-icon
												@click="removeDelivery"
											>mdi-close</v-icon>
										</button>
									</div>
									<div class="flex-3 flex-column justify-center ml-10" style="word-break: break-all;">
										<p>{{  item_upload_logo_img.name }}</p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<th>사업자 구분 <span class="color-red">*</span></th>
							<td colspan="3">
								<button
									v-for="(code, index) in codes.B002.items"
									:key="code.total_code + '_' + index"

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
									class="input-box-inline"
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
									class="input-box-inline"
									placeholder="사업자 등록 번호"
								/>
							</td>
							<th>법인등록번호 <span class="color-red">*</span></th>
							<td>
								<input
									type="number"
									v-model="item.back"
									:ruels="[rules.max(item, 'back', 13)]"
									class="input-box-inline"
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
									class="box pa-5-10 bg-identify"
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
						<tr
							v-if="false"
						>
							<th>보유 PG 정보</th>
							<td colspan="3">
								<select
									v-model="item.pg_code"
									class="pa-5-10 mr-10"
									:disabled="item_pg.pg_status == '1'"
								>
									<option value="">PG사</option>
									<option
										v-for="(code, index) in codes.P004.items"
										:key="code.total_code + '_' + index"
										:value="code.code_value"
									>{{ code.code_name }}</option>
								</select>

								<input
									v-model="item.pgMerchNo"
									class="pa-5-10 mr-10 box"
									placeholder="가맹점 ID"
									maxlength="20"
									:disabled="item_pg.pg_status == '1'"
								/>

								<input
									v-model="item.pgMerchName"
									class="pa-5-10 mr-10 box"
									placeholder="터미널 ID"
									maxlength="15"
									:disabled="item_pg.pg_status == '1'"
								/>

								<input
									v-model="item.pg_fee"
									class="pa-5-10 mr-10 box"
									placeholder="PG 결제 수수료"
									:rules="[$rules.demical(item, 'pg_fee', {min: 2, max:2})]"
									:disabled="item_pg.pg_status == '1'"
								/>

								<div
									v-if="item_pg.uid && item_pg.pg_status != '1'"
									class="color-red mt-10"
								>보유 PG 정보 확인 중입니다</div>
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
import Modal from "@/components/Modal";
import input_file from '@/components/InputFile'
export default {
	name: 'AgencyDetail'
	,
	components: {DaumPost, Modal, input_file},
	props: ['Axios', 'user', 'codes', 'rules', 'date', 'TOKEN']
	,data: function(){
		return {
			program: {
				name: '영업점 상세정보'
				, top: true
				, title: true
				, bottom: false
			}
			,item: {
				agency_type: ''
				, bank_code: ''
				, agency_upper: ''
				, business_type: ''
				, pg_code: ''
				, sales_pg_uid: ''
			}
			, item_pg: {
				uid: ''
			}
			, sales_pg_uid: ''
			, is_data_pick: false
			, is_modal: false
			, is_post: false
			, daum_config: {
				width: '360px'
			}
			, items_upper: []
			, item_logo_img: ''
			, item_upload_logo_img: {}
			, items_pg_list: []
		}
	}
	,computed: {

		logo_img_name: function(){
			let name = '로고 이미지'
			return name
		}
		, text_fee_rate: function(){
			let t = '공급가 마진'
			if(this.item.agency_type == 'A001003'){
				t = '공급가 마진'
			}
			return t
		}
		, text_bg_pg: function(){
			let t = ''

			if(this.item.sales_pg_uid && this.item.sales_pg_uid == this.item_pg.uid){
				if(this.item_pg.pg_status == '1'){
					t = 'bg-success'
				}else{
					t = 'bg-error'
				}
			}else if(!this.item_pg.uid && this.item.sales_pg_uid === this.item_pg.uid){
				t = 'bg-success'
			}

			return t
		}
		, text_upper_sales_fee: function(){
			let t = 0
			t += Number(Number(this.item.sales_fee) + Number(this.item_pg.pg_fee ? this.item_pg.pg_fee : 0))
			this.items_upper.filter( (item) =>{
				if(this.item.agency_upper == item.uid){
					t += Number(item.sales_fee) + Number(item.upper_sales_fee ? item.upper_sales_fee : 0)
				}
			})
			return t
		}
		, text_upper_sales_fee_bank: function(){
			let t = 0
			t += Number(this.item.sales_fee_bank)
			this.items_upper.filter( (item) =>{
				if(this.item.agency_upper == item.uid){
					t += Number(item.sales_fee_bank) + Number(item.upper_sales_fee_bank ? item.upper_sales_fee_bank : 0)
				}
			})
			return t
		}
		, item_upper: function(){
			let t = {}
			this.items_upper.filter( (item) => {
				if(this.item.agency_upper == item.uid){
					t = item
					return
				}
			})
			return t
		}
		, pg_sales_list: function(){
			return this.items_pg_list.filter( (item) => {
				item.total_rate =  Number(item.pg_fee) + Number(item.fee_rate) + Number(item.fee_upper ? item.fee_upper : 0) + Number(item.distributor_fee_rate ? item.distributor_fee_rate : 0)
				return item
			})
		}
	}
	, methods: {
		getData: async function(){
			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getAgency'
					,data: {
						agency_uid: this.$route.params.idx
					}
				})
				if(result.success){
					this.item = result.data.info
					if(result.data.pg_info){
						this.item_pg = result.data.pg_info
					}
					this.item_upload_logo_img = {
						src: this.item.shop_logo_view
						, name: this.item.shop_logo_view
						, type: 'image'
					}
					this.item_logo_img = ''
					await this.getAgencyUpper()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, save: async function(){
			try{
				this.$bus.$emit('on', true)

				if(this.item_logo_img){
					this.$set(this.item, 'item_logo_img', this.item_logo_img)
				}

				this.$set(this.item, 'sales_pg_list', JSON.stringify(this.items_pg_list))

				const result = await this.$request.init({
					method: 'post'
					,url: 'management/putAgency'
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
				this.$bus.$emit('on', false)
			}
		}

		,daumPost: function () {
			this.is_post = true
		}
		, addPost: function (call) {

			this.$set(this.item, 'shop_zip_code', call.zonecode)
			this.$set(this.item, 'shop_address', call.address)

			this.is_post = false
		}
		, toList: function(){
			this.$storage.push({ name: 'AgencyList', not_query: true})
		}
		, getAgencyUpper: async function(){
			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getAgencyUpper'
					,data: {
						agency_type: this.item.agency_type
					}
				})
				if(result.success){
					this.items_upper = result.data

					await this.getPgList()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
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
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postAgencyPasswordReset'
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
				this.$bus.$emit('on', false)
			}
		}

		, setFile2: function(e){
			console.log('setFile2', e)

			let self = this
			for(let file of e){
				console.log(`file` , file)
				this.item_logo_img = file

				const reader = new FileReader()
				let data = {
					name: file.name
					, size: file.size
					, type: file.type
				}

				reader.onload = function(e){
					console.log('reader.onload')
					data.src = e.target.result
					self.item_upload_logo_img = data
				}

				reader.readAsDataURL(file)
			}
		}
		, removeDelivery: async function(){
			if(this.item_logo_img){

				if(this.item.shop_logo){
					this.item_upload_logo_img = {
						src: this.item.shop_logo
						, name: this.item.shop_logo
						, type: 'image'
					}
					this.item_logo_img = {}
				}else{
					this.item_upload_logo_img = {}
					this.item_logo_img = {}
				}
			}else{
				if(confirm("삭제하시겠습니까?")){

					try{
						const result = await this.$request.init({
							method: 'post'
							,url: 'management/postShopLogoDelete'
							,data: {
								uid: this.item.uid
							}
						})

						if(result.success){
							this.item_upload_logo_img = {}
							this.item_logo_img = {}
						}else{
							this.$bus.$emit('notify', { type: 'error', message: result.message })
						}
					}catch (e) {
						console.log(e)
					}
				}
			}
		}
		, getPgList: async function(){
			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getAvailablePgList'
					,data: {
						agency_type: this.item.agency_type
						, upper_id: this.item_upper.agency_id
						, agency_id: this.item.agency_id
					}
				})
				if(result.success){
					this.items_pg_list = result.data
				}else{
					this.items_pg_list = []
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, setPg: function(pg){
			this.item_pg = pg
			this.item.sales_pg_uid = pg.uid
		}
		, setFeeStatus: function(item, type){
			this.items_pg_list.filter( (pg) => {
				pg.fee_status = 0
			})
			if(type){
				item.fee_status = 1
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

.v-file-input__text--placeholder {
	color: #bbb !important;
	font-size: 14px;
}

.theme--light.v-icon {
	color: #bbb;
}

.item_close {
	position: absolute; right: 10px; top: 10px
}
</style>
