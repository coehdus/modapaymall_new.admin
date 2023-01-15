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
								{{ user.account_id }}
							</td>
							<th>가입일</th>
							<td class="position-relative">
								{{ item.join_date }}
							</td>
						</tr>
						<tr>
							<th>이름 <span class="color-red">*</span></th>
							<td>
								{{ user.agency_name }}
							</td>
							<th>휴대폰 번호</th>
							<td>
								{{ item.account_phone_number }}
							</td>
						</tr>
						<tr>
							<th>비밀번호 변경</th>
							<td colspan="3" class="text-right">
								<button
									class="bg-identify pa-5-10"

									@click="onPassword"
								>비밀번호 변경</button>
							</td>
						</tr>
						</tbody>
					</table>

					<h6 class="under-line-identify mt-10">사업자 정보</h6>
					<table class="table th-left td-left">
						<col width="120px">
						<col width="auto">
						<col width="120px">
						<col width="auto">
						<tbody>
						<tr>
							<th>사업자 구분 <span class="color-red">*</span></th>
							<td colspan="3">
								<template
									v-for="code in codes.B002.items"
								>
									<span
										v-if="code.total_code == item.business_type"
										:key="code.total_code"

										class="pa-5-10"
										:class="item.business_type == code.total_code ? 'bg-green' : 'bg-default'"

									>{{ code.code_name }}</span>
								</template>
							</td>
						</tr>
						<tr
							v-if="item.business_type == 'B002002'"
						>
							<th>사업자등록번호 <span class="color-red">*</span></th>
							<td colspan="3">
								{{ item.front }}
							</td>
						</tr>
						<tr
							v-if="item.business_type == 'B002001'"
						>
							<th>사업자등록번호 <span class="color-red">*</span></th>
							<td>
								{{ item.front }}
							</td>
							<th>법인등록번호 <span class="color-red">*</span></th>
							<td>
								{{ item.back }}
							</td>
						</tr>
						<tr
							v-if="item.business_type == 'B002003'"
						>
							<th>주민등록 번호 <span class="color-red">*</span></th>
							<td colspan="3">
								{{ item.front }}
								{{ item.back }}
							</td>
						</tr>

						<tr>
							<th>상점명 <span class="color-red">*</span></th>
							<td>
								{{ item.shop_name }}
							</td>
							<th>대표자명 <span class="color-red">*</span></th>
							<td>{{ item.shop_ceo }}</td>
						</tr>
						<tr>
							<th>사업장 주소 <span class="color-red">*</span></th>
							<td colspan="3">

								{{ item.shop_zip_code }}
								{{ item.shop_address }}
								{{ item.shop_address_detail }}
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
						<tr
							v-if="item.agency_type == 'A001003'"
						>
							<th>결제 PG</th>
							<td colspan="3">{{ item_pg.pg_name }}</td>
						</tr>
						<tr>
							<th>정산주기</th>
							<td
								v-if="user.role == 'distributor'"
								class="text-left"
								colspan="3"
							>영업일 기준 / 월 정산</td>
							<td
								v-else
								class="text-left"
							>영업일 기준 / 월 정산</td>
							<th
								v-if="user.role == 'agency'"
							>판매 수수료<span class="color-red">*</span></th>
							<th
								v-else-if="user.role == 'admin'"
							>수수료<span class="color-red">*</span></th>
							<td
								v-if="user.role != 'distributor'"
							>
								<div class="flex justify-space-between"> <span>카드 결제</span> <span>{{ sales_fee | toFixed(2) }}% </span></div>
								<div  class="flex justify-space-between mt-10"> <span>무통장 입금</span> <span>{{ item.sales_fee_bank }}%</span></div>
							</td>
						</tr>
						<tr>
							<th>은행</th>
							<td>
								{{ item.bank_name }}
							</td>
							<th>계좌번호</th>
							<td>
								{{ item.bank_account }}
							</td>
						</tr>
						<tr>
							<th>예금주</th>
							<td>
								{{ item.bank_holder }}
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
								<span class="pa-5-10" :class="'bg-' + item.shop_status_color ">{{ item.shop_status_name }}</span>
								<div
									class="mt-10 pa-10 box"
									v-if="item.shop_status == '0'"
								>현재는 상품 판매가 불가능합니다. 관리자에게 문의하세요</div>
							</td>
						</tr>
						<tr>
							<th>{{  text_pg_title }}</th>
							<td>
								<table class="table">
									<thead>
										<tr>
											<th>PG명</th>
											<th>공급가</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="(pg, p_index) in item_pg"
											:key="'pg_' + p_index"
											class="mb-5"
										>
											<td class="text-left">{{ pg.pg_name }}</td>
											<td>{{ pg.total_rate }}%</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr
							v-if="user.account_type_code == 'A001003'"
						>
							<th>상점 로고 <br/> 150 x 100 </th>
							<td>
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
											style="max-width: 180px"
										/>
										<button class="item_close" style="background-color: black">
											<v-icon
												@click="removeFile"
											>mdi-close</v-icon>
										</button>
									</div>
									<div class="flex-3 flex-column justify-center ml-10">
										<p>{{  item_upload_logo_img.name }}</p>
									</div>
								</div>
							</td>
						</tr>
						<tr
							v-if="false"
						>
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
						<tr
							v-if="false"
						>
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
						<tr
							v-if="false"
						>
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
						<tr
							v-if="false"
						>
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
		</div>
		<DaumPost
			:overlay="is_post"
			:config="daum_config"
			@callBack="addPost"
		></DaumPost>

		<Modal
			:is_modal="is_password"
			:option="modal_option"

			width="320px"
			height="240px"

			@click="putPassword"
			@close="clearPassword"
			@cancel="clearPassword"
		>
			<div
				slot="modal-title"
				class="pa-10 text-center bg-white under-line"
			><h6>비밀번호 변경</h6></div>
			<div
				slot="modal-content"
			>
				<div>
				<input
					v-model="item_password.account_password_old"
					type="password"
					class="box pa-10 width-100" placeholder="기존 비밀번호"
				/>
				</div>
				<div class="mt-10">
				<input
					v-model="item_password.account_password"
					type="password"
					class="box pa-10 width-100" placeholder="신규 비밀번호"
				/>
				</div>
				<div class="mt-10">
				<input
					v-model="item_password.account_password_confirm"
					type="password"
					class="box pa-10 width-100" placeholder="비밀번호 확인"
				/>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>

import DaumPost from "@/components/Daum/DaumPost";
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import Modal from "@/components/Modal";
import input_file from '@/components/InputFile'

export default {
	name: 'MypageAgency'
	, components: {DaumPost, Editor, Modal, input_file}
	, props: ['Axios', 'user', 'codes', 'rules', 'date', 'TOKEN']
	, data: function(){
		return {
			program: {
				name: '상점 설정'
				, top: true
				, title: true
				, bottom: false
			}
			,item: {
				agency_type: ''
				,business_type: 'B002001'
				,bank_code: ''
				,join_date: this.date.getToday('-')
				,delivery_type: '0'
				,shop_return: ''
			}
			, item_pg: {

			}
			,is_data_pick: false
			,is_modal: false
			,is_post: false
			,daum_config: {
				width: '360px'
			}
			,modal_option: {
				title: false
				,bottom: true
				, top: true
			}
			, is_password: false
			, item_password: {
				account_password: ''
				, account_password_confirm: ''
				, account_password_old: ''
			}
			, upload_files: []
			, item_logo_img: null
			, item_upload_logo_img: {}
		}
	}
	,computed: {
		logo_img_name: function(){
			let name = '로고 이미지'
			return name
		}
		, sales_fee: function(){
			let t = 0

			t += Number(this.item.sales_fee)

			if(this.item.upper_sales_fee){
				t += Number(this.item.upper_sales_fee)
			}

			if(this.item_pg.uid){
				t += Number(this.item_pg.pg_fee)
			}

			return t
		}
		, text_pg_title: function(){
			let t = ''
			switch (this.user.agency_type){
				case  'A001001':
					t = '보유 PG 정보'
					break
				case 'A001002':
					t = 'PG 공급가 정보'
					break
				case 'A001003':
					t = '결제 PG 정보'
					break
			}
			return t
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
						agency_uid: this.user.uid
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

				const result = await this.$request.init({
					method: 'post'
					,url: 'management/putAgencyMyInfo'
					,data: {
						bank_email: this.item.bank_email
						, pg_code: this.item.pg_code
						, pgMerchNo: this.item.pgMerchNo
						, pgMerchName: this.item.pgMerchName
						, pg_fee: this.item.pg_fee
						, item_logo_img: this.item.item_logo_img
					}
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
		, onPassword: function(){
			this.is_password = true
		}

		, putPassword: async function(){
			try{
				const result = await this.$request.init({
					method: 'post'
					, url: 'management/putPassword'
					, data: {
						account_type: this.user.account_type_code
						, account_uid: this.user.account_uid
						, account_password_old: this.item_password.account_password_old
						, account_password: this.item_password.account_password
						, account_password_confirm: this.item_password.account_password_confirm
					}
				})
				if(result.success){
					this.$bus.$emit('notify',{ type: 'success', message: this.$language.common.success})
					this.clearPassword()
				}else{
					throw result.message
				}
			}catch(e){
				console.log(e)
				this.$bus.$emit('notify',{ type: 'error', message: e})
			}
		}
		, clearPassword: function(){
			this.is_password = false
			this.item_password = {
				account_password: ''
				, account_password_confirm: ''
				, account_password_old: ''
			}
		}
		, setFile2: function(e){
			console.log('setFile2', e)

			for(let file of e){
				console.log(`file` , file)
				this.item_logo_img = file

				const reader = new FileReader()
				let data = {
					name: file.name
					, size: file.size
					, type: file.type
				}

				reader.onload = (e) => {
					console.log('reader.onload')
					data.src = e.target.result
					this.item_upload_logo_img = data
				}

				reader.readAsDataURL(file)
			}
		}
		, removeFile: async function(){
			if(this.item_logo_img){

				if(this.item.shop_logo){
					this.item_upload_logo_img = {
						src: this.item.shop_logo
						, name: this.item.shop_logo
						, type: 'image'
					}
					this.item_logo_img = null
				}else{
					this.item_upload_logo_img = {}
					this.item_logo_img = null
				}
			}else{
				if(confirm("삭제하시겠습니까?")){

					try{
						const result = await this.$request.init({
							method: 'post'
							,url: 'management/postShopLogoDelete'
							,data: {
								shop_uid: this.item.uid
							}
						})

						if(result.success){
							this.item_upload_logo_img = {}
							this.item_logo_img = null
						}else{
							this.$bus.$emit('notify', { type: 'error', message: result.message })
						}
					}catch (e) {
						console.log(e)
					}
				}
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
.theme--light.v-icon {
	color: #bbb;
}

.item_close {
	position: absolute; right: 10px; top: 10px
}
</style>
