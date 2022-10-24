<template>
	<div class="full-height">
		<div
			class="full-height"
		>
			<div
				class="justify-space-between "
			>
				<div class="flex-1 bg-white pa-10 mr-10">
					<h6>기본 정보</h6>
					<table class="table th-left td-right">
						<col width="130px">
						<col width="auto">
						<col width="130px">
						<col width="auto">
						<tbody>
							<tr>
								<th>사이트명</th>
								<td><input v-model="item.site_name" class="input-box" placeholder="사이트명을 입력하세요" maxlength="50"></td>
								<th>사이트 URL</th>
								<td><input v-model="item.site_url" class="input-box" placeholder="사이트 URL을 입력하세요" maxlength="150"></td>
							</tr>
							<tr>
								<th>대표자</th>
								<td><input v-model="item.site_ceo" class="input-box" placeholder="대표자명을 입력하세요" maxlength="10"></td>
								<th>개인정보관리자</th>
								<td><input v-model="item.site_personal_manager" class="input-box" placeholder="개인정보관리자를 입력하세요" maxlength="10"></td>
							</tr>
							<tr>
								<th>사업자등록번호</th>
								<td><input v-model="item.site_biz_number" type="number" class="input-box" placeholder="사업자등록번호를 입력하세요" :rules="[rules.max(item, 'site_biz_number', 10)]"></td>
								<th>통신판매업 번호</th>
								<td><input v-model="item.site_report_number" class="input-box" placeholder="통신판매신고 번호를 입력하세요" maxlength="25" ></td>
							</tr>
							<tr>
								<th>대표 번호</th>
								<td><input v-model="item.site_tell" type="number" class="input-box" placeholder="대표번호를 입력하세요" :rules="[rules.max(item, 'site_tell', 12)]"></td>
								<th>이메일</th>
								<td><input v-model="item.site_email" class="input-box" placeholder="이메일을 입력하세요" maxlength="50"></td>
							</tr>
							<tr>
								<th>이용 약관</th>
								<td><button class="bg-identify pa-5-10" @click="is_modal_terms = true">열기</button></td>
								<th>개인정보 취급방침</th>
								<td><button class="bg-identify pa-5-10" @click="is_modal_personal = true">열기</button></td>
							</tr>
						</tbody>
					</table>

					<h6 class="under-line-identify mt-10">기본 수익 및 수수료 설정</h6>
					<table class="table th-left td-left">
						<col width="130px">
						<col width="auto">
						<col width="auto">
						<thead>
							<tr>
								<th>구분</th>
								<th>카드</th>
								<th>무통장</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th>운영 수익률 <span class="color-red">*</span></th>
								<td>
									<input
										v-model="item.company_fee"
										class="input-box full-width pa-5-10 mr-10"
										placeholder="수수료를 입력하세요"
										:rules="[rules.demical(item, 'company_fee', { min: 2, max: 2})]"

										@keyup.enter="save"
									/>
								</td>
								<td>
									<input
										v-model="item.bank_company_fee"
										class="input-box full-width pa-5-10 mr-10"
										placeholder="수수료를 입력하세요"
										:rules="[rules.demical(item, 'bank_company_fee', { min: 2, max: 2})]"

										@keyup.enter="save"
									/>
								</td>
							</tr>
							<tr>
								<th>총판 수익률</th>
								<td class="position-relative">
									<input
										v-model="item.distributor_fee"
										class="input-box full-width"
										placeholder="수익률을 입력하세요"
										:rules="[rules.demical(item, 'distributor_fee', { min: 2, max: 2})]"

										@change="setAgencyPer"
									/>
								</td>
								<td class="position-relative">
									<input
										v-model="item.bank_distributor_fee"
										class="input-box full-width"
										placeholder="수익률을 입력하세요"
										:rules="[rules.demical(item, 'bank_distributor_fee', { min: 2, max: 2})]"

										@change="setAgencyPer"
									/>
								</td>
							</tr>
							<tr>
								<th>대리점 수익률</th>
								<td class="position-relative">
									<input
										v-model="item.agency_fee"
										class="input-box full-width"
										placeholder="수익률을 입력하세요"
										:rules="[rules.demical(item, 'agency_fee', { min: 2, max: 2})]"

										@change="setAgencyPer"
									/>
								</td>
								<td class="position-relative">
									<input
										v-model="item.bank_agency_fee"
										class="input-box full-width"
										placeholder="수익률을 입력하세요"
										:rules="[rules.demical(item, 'bank_agency_fee', { min: 2, max: 2})]"

										@change="setAgencyPer"
									/>
								</td>
							</tr>
							<tr>
								<th>공급사 판매 수수료</th>
								<td class="position-relative">
									<input
										v-model="item.supply_fee"
										class="input-box full-width"
										placeholder="수수료를 입력하세요"
										:rules="[rules.demical(item, 'supply_fee', { min: 2, max: 2})]"

										@change="setAgencyPer"
									/>
								</td>
								<td class="position-relative">
									<input
										v-model="item.bank_supply_fee"
										class="input-box full-width"
										placeholder="수수료를 입력하세요"
										:rules="[rules.demical(item, 'bank_supply_fee', { min: 2, max: 2})]"

										@change="setAgencyPer"
									/>
								</td>
							</tr>
							<tr>
								<th>PG 수수료 <span class="color-red">*</span></th>
								<td>
									<input
										v-model="item.pg_fee"
										class="input-box full-width pa-5-10 mr-10"
										placeholder="수수료를 입력하세요"
										:rules="[rules.demical(item, 'company_fee', { min: 2, max: 2})]"

										@keyup.enter="save"
									/>

									<div class="mt-10">
									우측의 PG사 등록 정보 사용시 해당 PG 결제 수수료가 적용됩니다
									</div>

								</td>
								<td class="text-center">-</td>
							</tr>
							<tr>
								<th>최종 결제 수수료</th>
								<td>{{ fee_card }} %</td>
								<td>{{ fee_bank }} %</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="flex-1 bg-white pa-10 mr-10">

					<h6 class="under-line-identify">운영정보</h6>
					<table class="table th-left td-left">
						<col width="130px">
						<col width="auto">
						<tbody>
						<tr>
							<th>수수료 적용여부 <span class="color-red">*</span></th>
							<td class="">
								<button
									class=" pa-5-10"
									:class="item.is_per === '1'? 'bg-identify' : 'bg-default'"
									@click="item.is_per = '1'"
								>일괄 적용</button>
								<button
									class=" pa-5-10"
									:class="item.is_per === '2'? 'bg-identify' : 'bg-default'"
									@click="item.is_per = '2'"
								>개별 우선 적용</button>
								<button
									class=" pa-5-10"
									:class="item.is_per === '3'? 'bg-identify' : 'bg-default'"
									@click="item.is_per = '3'"
								>개별 적용</button>
								<div  class="mt-10 pa-10 box">
									<div v-if="item.is_per == '1'">관리설정에 등록된 수수료가 일괄 적용됩니다</div>
									<div v-else-if="item.is_per == '2'">영업점 및 공급사에 적용된 개별 수수료가 우선 적용됩니다 <br/> 판매 수수료는 영업점 별로 달라질수 있습니다.</div>
									<div v-else-if="item.is_per == '3'">영업점 및 공급사에 적용된 개별 수수료가 적용됩니다 <br/> 판매 수수료는 영업점 별로 달라질수 있습니다.</div>
								</div>
							</td>
						</tr>
						<tr>
							<th>판매여부 <span class="color-red">*</span></th>
							<td class="">
								<button
									class=" pa-5-10"
									:class="item.is_sale === '1'? 'bg-identify' : 'bg-default'"
									@click="item.is_sale = '1'"
								>판매</button>
								<button
									class=" pa-5-10"
									:class="item.is_sale === '0'? 'bg-danger' : 'bg-default'"
									@click="item.is_sale = '0'"
								>미판매</button>
								<div  class="mt-10 pa-10 box">
									<template v-if="item.is_sale == '1'">
										상품 주문이 가능합니다
									</template>
									<template v-else>
										상품 주문이 불가능합니다
									</template>
								</div>
							</td>
						</tr>
						</tbody>
					</table>

					<h6 class="under-line-identify mt-10">결제 정보</h6>
					<table class="table th-left td-left">
						<col width="130px">
						<col width="auto">
						<tbody>
							<tr>
								<th>결제 방법</th>
								<td>

									<button
										class="pa-5-10 mr-5"
										:class="item.is_bank == '1' ? 'bg-identify' : ' btn-default'"
										@click="item.is_bank = item.is_bank == '1' ? '0' : '1'"
									>
										<v-icon
											v-if="item.is_bank == '1'"
											small class="color-eee"
										>mdi mdi-checkbox-marked-outline</v-icon>
										<v-icon
											v-else
											small class="color-333"
										>mdi mdi-checkbox-blank-outline</v-icon>
										무통장 입금
									</button>

									<button
										class="pa-5-10 "
										:class="item.is_card == '1' ? 'bg-identify' : ' btn-default'"
										@click="item.is_card = item.is_card == '1' ? '0' : '1'"
									>
										<v-icon
											v-if="item.is_card == '1'"
											small class="color-eee"
										>mdi mdi-checkbox-marked-outline</v-icon>
										<v-icon
											v-else
											small class="color-333"
										>mdi mdi-checkbox-blank-outline</v-icon>
										카드 결제
									</button>
								</td>
							</tr>
							<tr>
								<th>무통장 입금 정보</th>
								<td>
									<select
										v-model="item.bank_code"
										class="input-box width-20 mr-10"
									>
										<option value="">은행을 선택하세요</option>
										<option
											v-for="(code, index) in codes.B001.items"
											:key="code.total_code + '_' + index"
											:value="code.total_code"
										>{{ code.code_name }}</option>
									</select>

									<input
										v-model="item.bank_account"
										maxlength="50"
										placeholder="계좌번호를 입력하세요"
										class=" input-box width-20 mr-10"
										/>

									<input
										v-model="item.bank_holder"
										maxlength="10"
										placeholder="예금주를 입력하세요"
										class=" input-box width-20"
									/>
								</td>
							</tr>
						</tbody>
					</table>

					<div class="justify-space-between mt-10">
						<h6>PG사 정보</h6>
						<button @click="is_modal_pg = true"><v-icon small class="box color-white bg-identify">mdi mdi-plus</v-icon></button>
					</div>

					<template
						v-if="pg_list.length > 0"
					>
						<table class="table table-even">
							<colgroup>

							</colgroup>
							<thead>
								<tr>
									<th>PG사</th>
									<th>결제 수수료</th>
									<th>사용여부</th>
									<th>상세 정보</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(pg, index) in pg_list"
									:key="pg.pgMerchNo + '_' + index"
								>
									<td>{{ pg.pg_name }}</td>
									<td>{{ pg.pg_fee }}%</td>
									<td>
										<div
											class=" flex-row justify-center"
										>
											<v-icon
												class="pa-5 "
												:class="pg.pg_status == 1 ? 'bg-green color-white' : 'btn-default' "
												@click="checkPG(pg, true)"
											>mdi mdi-power-plug</v-icon>
											<v-icon
												class="pa-5  "
												:class="pg.pg_status != 1 ? 'bg-red color-white' : 'btn-default' "
												@click="checkPG(pg, false)"
											>mdi mdi-power-plug-off</v-icon>

											<v-icon
												class="pa-5 bg-red color-white ml-10"
												@click="isDeleteItem(pg)"
											>mdi mdi-delete</v-icon>
										</div>
									</td>
									<td>
										<button
											class="bg-identify pa-5-10"
											@click="toDetail(pg)"
										>상세정보</button>
									</td>
								</tr>
							</tbody>
						</table>
					</template>
					<Empty
						v-else

						style="max-height: 340px"
					></Empty>
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

		<Modal
			v-show="is_modal_terms"
			:is_modal="true"
			:top="true"
			:bottom="true"
			title="이용약관"
			content_class="full-height"

			@close="close"
			@click="close"
			@cancel="close"
		>
			<template slot="modal-content">
				<editor
					v-if="item.site_terms"
					:initialValue="item.site_terms"
					height="650px"
					initialEditType="wysiwyg"
					ref="site_terms"
					class="text-left"
				/>
				<editor
					v-else
					height="650px"
					initialEditType="wysiwyg"
					ref="site_terms"
					class="text-left"
				/>
			</template>
		</Modal>

		<Modal
			v-show="is_modal_personal"
			:is_modal="true"
			:top="true"
			:bottom="true"
			title="개인정보 취급방침"
			content_class="full-height"

			@close="close"
			@click="close"
			@cancel="close"
		>
			<template slot="modal-content">
				<editor
					v-if="item.site_personal"
					:initialValue="item.site_personal"
					height="650px"
					initialEditType="wysiwyg"
					ref="site_personal"
					class="text-left"
				/>
				<editor
					v-else
					height="650px"
					initialEditType="wysiwyg"
					ref="site_personal"
					class="text-left"
				/>
			</template>
		</Modal>

		<Modal
			:is_modal="is_modal_pg"
			title="PG사 등록"
			top="true"
			width="520px"

			@close="close"
		>
			<ManagerPgItem
				slot="modal-content"
				:Axios="Axios"
				:user="user"
				:codes="codes"
				:rules="rules"
				:TOKEN="TOKEN"
				:uid="uid"

				@success="success"
				@setNotify="setNotify"
				@cancel="close"
			></ManagerPgItem>
		</Modal>

		<Popup_confirm
			v-if="is_confirm"

			@cancel="is_confirm = false"
			@click="update"
		>
			<template
				v-slot:title
			>결제용 PG 변경</template>
			<template
				v-slot:main-txt
			>해당 PG사로 변경 하시겠습니까?</template>
			<template
				v-slot:sub-txt
				class="mt-10"
			>변경 후 결제요청은 변경된 PG사로만 가능합니다</template>
		</Popup_confirm>

		<Popup_confirm
			v-if="is_confirm2"

			@cancel="is_confirm2 = false"
			@click="update"
		>
			<template
				v-slot:title
			>결제용 PG 변경</template>
			<template
				v-slot:main-txt
			>현재 사용중인 결제용 PG사입니다</template>
			<template
				v-slot:sub-txt
				class="mt-10"
			>미사용으로 변경시 결제가능한 PG사가 없습니다.</template>
		</Popup_confirm>

	</div>
</template>

<script>

import Modal from "@/components/Modal";
import ManagerPgItem from "@/view/Manager/ManagerPgItem";
import Empty from "@/view/Layout/Empty";

import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import Popup_confirm from "@/view/Layout/PopupConfirm";

export default {
	name: 'ManagerItem'
	, components: {Popup_confirm, Empty, ManagerPgItem, Modal, Editor}
	, props: ['Axios', 'user', 'codes', 'rules', 'TOKEN']
	, data: function(){
		return {
			program: {
				name: '관리 설정'
				, top: true
				, title: true
				, bottom: false
			}
			, pg_list: []
			,item: {
				ATOKEN: this.TOKEN
				, admin_type: 'A001001'
				, admin_level: ''
				, is_sale: '1'
				, is_per: '1'
				, bank_code: ''
				, site_terms: ''
				, site_personal: ''
			}
			, is_modal_pg: false
			, is_modal_terms: false
			, is_modal_personal: false
			, uid: ''
			, is_confirm: false
			, is_confirm2: false
			, item_pg: {}
		}
	}
	,computed: {
		agency_per: function(){
			let per = []

			if(this.item.agency_per){
				per = JSON.parse(this.item.agency_per)
			}else{
				for(let code in this.codes.B003.items){
					per.push({ code: code.total_code, name: code.code_name, val: 0})
				}
			}

			return per
		}
		, fee_card: function(){
			let fee = 0
			
			fee += Number(this.item.pg_fee)
			fee += Number(this.item.company_fee)
			fee += Number(this.item.distributor_fee)
			fee += Number(this.item.agency_fee)
			fee += Number(this.item.supply_fee)
			
			return fee.toFixed(2)
		}
		, fee_bank: function(){
			let fee = 0

			fee += Number(this.item.bank_company_fee ?? 0)
			fee += Number(this.item.bank_distributor_fee ?? 0)
			fee += Number(this.item.bank_agency_fee ?? 0)
			fee += Number(this.item.bank_supply_fee ?? 0)

			return fee.toFixed(2)
		}
	}
	, methods: {
		getData: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getSetting'
				})
				if(result.success){
					this.item = result.data
					if(!this.item.bank_code){
						this.item.bank_code = ''
					}
					this.$set(this.item, 'ATOKEN', this.TOKEN)
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,save: async function(){
			try{

				this.$emit('onLoading')

				let site_terms = this.$refs.site_terms.invoke("getMarkdown")

				if(!site_terms){
					this.$refs.site_terms.invoke("setMarkdown", this.item.site_terms)
				}

				this.item.site_terms = site_terms


				let site_personal = this.$refs.site_personal.invoke("getMarkdown")

				if(!site_personal){
					this.$refs.site_personal.invoke("setMarkdown", this.item.site_personal)
				}

				this.item.site_personal = site_personal

				const result = await this.Axios({
					method: 'post'
					,url: 'management/postSetting'
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
		, getPgList: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getPgList'
					,data: this.search
				})
				if(result.success){
					this.pg_list = result.data
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,setAgencyPer: function(){

		}
		,do: async function(){
			await this.getPgList()
			await this.getData()
		}
		, success: function(){
			this.$bus.$emit('notify', { type: 'success', message: '정상적으로 처리되었습니다'})
			this.close()
			this.getPgList()
		}
		, setNotify: function({ type, message}){
			this.$bus.$emit('notify', { type: type, message: message})
		}
		, close: function(){
			this.is_modal_pg = false
			this.is_modal_terms = false
			this.is_modal_personal = false
			this.uid = ''
		}

		, update: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postPgItemUpdate'
					,data: {
						ATOKEN: this.TOKEN
						, uid: this.item_pg.uid
						, pg_status: this.item_pg.pg_status == '1' ? '0' : '1'
					}
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message })
					await this.getPgList()
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				this.$emit('offLoading')
				this.is_confirm = false
				this.is_confirm2 = false
			}
		}
		, deleteItem: async function(item){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postDeletePgItem'
					,data: {
						ATOKEN: this.TOKEN
						, uid: item.uid
					}
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message })
					await this.getPgList()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
			}finally {
				this.$emit('offLoading')
			}
		}
		, toDetail: function(item){
			this.is_modal_pg = true
			this.uid = item.uid
		}
		, isDeleteItem: function(item){
			if(confirm("해당 PG사 정보를 삭제하시겠습니까?")){
				this.deleteItem(item)
			}
		}
		, checkPG: function(pg, type){
			if((type && pg.pg_status == '1') || (!type && pg.pg_status == '0')) {
				return false
			}else if(!type && pg.pg_status == '1'){
				this.is_confirm2 = true
				this.item_pg = pg
			}else{
				this.is_confirm = true
				this.item_pg = pg
			}
		}
	}
	, created() {
		this.$emit('onLoad', this.program)
		this.do()
	}
}
</script>

<style>
.width-fee { width: 60px !important; text-align: right;}
</style>
