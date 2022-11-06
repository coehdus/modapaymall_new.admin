<template>
	<div
		class="full-height"
	>
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
							<td
								v-if="codes.A001"
							>
								<template
									v-if="user.role_group == 'admin'"
								>
								<select
									v-model="item.agency_type"
									class="pa-5-10 "
									@change="getAgencyUpper"
								>
									<option value="">선택하세요</option>
										<template
											v-for="(agency, index) in codes.A001.items"
										>
											<option
												v-if="agency.code_index > 1 && agency.code_index < 4"
												:key="'agency_' + index"
												:value="agency.total_code"
											>{{ agency.code_name }}</option>
										</template>
								</select>
								</template>
								<template
									v-else
								>
									{{ codes.A001.items[2].code_name }}

								</template>
							</td>
							<th>소속 영업점</th>
							<td>
								<template
									v-if="user.role_group == 'admin'"
								>
									<select
										v-if="items_upper.length > 0"
										v-model="item.agency_upper"

										class="input-box"
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
								>{{ user.shop_name }}</template>
							</td>
						</tr>
						<tr>
							<th>아이디</th>
							<td>
								<input
									v-model="item.account_id"
									class="input-box full-width"
									placeholder="아이디를 입력하세요"
								/>

								<button
									v-if="false"
									class="pa-5-10 bg-blue-light "
								>중복 체크</button>
							</td>
							<th>등록일</th>
							<td class="position-relative">
								<input
									v-model="item.join_date"
									class="input-box full-width"
									placeholder="등록일을 선택하세요"
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
						</tr>
						<tr>
							<th>비밀번호</th>
							<td class="">
								<input
									v-model="item.account_password"
									type="password"
									class="input-box full-width"
									placeholder="비밀번호"
									max="50"
								/>
							</td>

							<th>비밀번호 확인</th>
							<td class="">
								<input
									v-model="item.account_password_confirm"
									type="password"
									class="input-box full-width"
									placeholder="비밀번호를 한번 더 입력하세요"
									max="50"
								/>
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
									:ruels="[rules.max(item, 'account_phone_number', 12)]"
									class="input-box full-width"
									placeholder="휴대폰번호를 입력하세요"
								/>
							</td>
						</tr>
						</tbody>
					</table>


					<div class="mt-10">
						<h6>정산 정보</h6>
						<table class="table th-left td-left">

							<col width="120px">
							<col width="auto">
							<col width="120px">
							<col width="auto">
							<tbody>
							<tr>
								<th> {{ text_fee_rate }} <span class="color-red">*</span></th>
								<td>
									<div
										class="justify-start"
									>
										<div class="flex-1 text-left justify-space-between">
											카드 결제
											<span>
											<input
												v-model="item.sales_fee"
												type="number"
												:rules="[rules.demical(item, 'sales_fee', { min: 2, max: 2})]"
												class="box pa-5-10 width-fee "
											/> %
												</span>
										</div>
									</div>
									<div
										class="justify-start mt-10"
									>
										<div class="flex-1 text-left justify-space-between">
											무통장 입금
											<span>
											<input
												v-model="item.sales_fee_bank"
												type="number"
												:rules="[rules.demical(item, 'sales_fee_bank', { min: 2, max: 2})]"
												class="box pa-5-10 width-fee "
											/> %
												</span>
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
							<th>상점명 <span class="color-red">*</span></th>
							<td colspan="3">
								<input
									type="text"
									v-model="item.shop_name"
									maxlength="50"
									class="input-box-inline"
									placeholder="상점명을 입력하세요"
								/>
							</td>
						</tr>
						<tr
							v-if="item.agency_type == 'A001003'"
						>
							<th>상점 로고</th>
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
										v-if="item_logo_img.type.indexOf('image') > -1"
										class="flex-1" style="position: relative"
									>
										<img
											:src="item_upload_logo_img.src"
											style="max-width: 180px"
										/>
										<button class="item_close" style="background-color: black">
											<v-icon
												@click="item_upload_logo_img = {}"
											>mdi-close</v-icon>
										</button>
									</div>
									<div class="flex-3 flex-column justify-center ml-10">
										<p>{{  item_upload_logo_img.name }}</p>
									</div>
								</div>
							</td>
						</tr>
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
	</div>
</template>

<script>

import DaumPost from "@/components/Daum/DaumPost";
import input_file from '@/components/InputFile'
export default {
	name: 'AgencyItem'
	,
	components: {DaumPost, input_file},
	props: ['Axios', 'user', 'codes', 'rules', 'date']
	,data: function(){
		return {
			program: {
				name: '영업점 등록'
				, top: true
				, title: true
				, bottom: false
			}
			,item: {
				agency_type: ''
				, business_type: 'B002001'
				, bank_code: ''
				, join_date: this.date.getToday('-')
				, agency_upper: this.user.role_group == 'agency' ? this.user.account_uid : ''
				, sales_fee: 0.5
				, sales_fee_bank: 0
			}
			,is_data_pick: false
			,is_modal: false
			,is_post: false
			,daum_config: {
				width: '360px'
			}
			,items_upper: []
			, upload_files: []
			, item_logo_img: {}
			, item_upload_logo_img: {}
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
	}
	, methods: {
		save: async function(){
			try{
				this.$emit('onLoading')

				this.$set(this.item, 'item_logo_img', this.item_logo_img)

				const result = await this.Axios({
					method: 'post'
					,url: 'management/postAgency'
					,data: this.item
				})
				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message})
					this.toList()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
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
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getAgencyUpper'
					,data: {
						agency_type: this.item.agency_type
						, account_uid: this.user.account_uid
					}
				})
				if(result.success){
					this.items_upper = result.data
					this.item.agency_upper = ''
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		, setFile: function(e){
			console.log('setFile', e)
			console.log(e[0].size / 1024)

			let file_count = this.files.length + e.length
			if(file_count > this.file_max){
				this.$emit('notify', { type: 'error', message: this.$language.common.error_file_limit})
				return false
			}

			console.log('for files')
			let self = this
			for(let file of e){
				console.log(`file` , file)
				this.upload_files.unshift(file)
				const reader = new FileReader()
				let data = {
					name: file.name
					, size: file.size
					, type: file.type
				}

				reader.onload = function(e){
					console.log('reader.onload')
					data.src = e.target.result
					self.files.unshift(data)
				}

				reader.readAsDataURL(file)
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
		, removeFile: function(index){
			this.files.splice(index, 1)

			for(const [key] of Object.entries(this.upload_files)) {
				delete this.item['upload_files' + key]
			}
			this.upload_files.splice(index, 1)
		}
	}
	, created() {
		this.$emit('onLoad', this.program)
		if(this.user.role_group == 'agency'){
			this.item.agency_type = this.codes.A001.items[2].total_code
		}
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