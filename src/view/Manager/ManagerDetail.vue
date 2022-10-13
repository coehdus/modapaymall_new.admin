<template>
	<div class="full-height">
		<div
			class="full-height"
		>
			<div
				class="justify-space-between"
			>
				<div class="flex-1 bg-white pa-10 mr-10 ">
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
								{{ item.account_id }}
							</td>
							<th>등급</th>
							<td class="position-relative">
								<select
									v-model="item.admin_level"
									class="input-box position-relative cursor-pointer"
									style="z-index: 1"
								>
									<option value="">선택하세요</option>
									<option
										v-for="(code, index) in codes.A002.items"
										:key="code.total_code + index"
										:value="code.code_value"
									>{{ code.code_name }}</option>
								</select>
								<v-icon
									class="position-absolute color-icon"
									style="right: 15px; top: 11px; z-index: 0"
								>mdi mdi-menu-down</v-icon>
							</td>
						</tr>
						<tr>
							<th>이름 <span class="color-red">*</span></th>
							<td>
								<input
									type="text"
									v-model="item.admin_name"
									maxlength="20"
									class="input-box full-width"
									placeholder="대표자 성명을 입력하세요"
								/>
							</td>
							<th>휴대폰 번호</th>
							<td>
								<input
									type="number"
									v-model="item.admin_phone"
									:ruels="[rules.max(item, 'admin_phone', 12)]"
									class="input-box full-width"
									placeholder="대표자 휴대폰번호를 입력하세요"
								/>
							</td>
						</tr>
						<tr>

							<th>계정상태</th>
							<td class="">
								<template
									v-for="(code, index) in codes.S003.items"
								>
									<span
										v-if="code.code_value == item.admin_status"
										:key="'admin_status_' + index"
									>{{ code.code_name }}</span>
								</template>
							</td>
							<th>비밀번호</th>
							<td>
								<button
									class="bg-blue-light pa-5-10"
									@click="isPassword"
								>비밀번호 초기화</button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>

				<div class="flex-1 pa-10">

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
export default {
	name: 'AgencyItem'
	,
	components: {Modal, DaumPost},
	props: ['Axios', 'user', 'codes', 'rules', 'TOKEN']
	,data: function(){
		return {
			program: {
				name: '관리자 상세정보'
				, top: true
				, title: true
				, bottom: false
			}
			,item: {

			}
			,sample: {
				agency_list: [
					{ idx:1, code: 1, name: '총판1'}
					, { idx:1, code: 2, name: '대리점1-1'}
					, { idx:1, code: 3, name: '리셀러1-1-1'}
					, { idx:1, code: 4, name: '대리점1-2'}
					, { idx:1, code: 5, name: '총판2'}
					, { idx:1, code: 6, name: '대리점2-1'}
					, { idx:1, code: 7, name: '리셀러2-1-1'}
				]
			}
			,is_modal: false
			,modal_option: {
				title: '비밀번호 초기화'
				,content: '비밀번호를 초기화 하고 등록된 연락처로 전송하시겠습니까?'
				,top: true
				,bottom: true
				,width: '360px'
			}
			,is_modal2: false
			,modal_option2: {
				title: '영업점 계정상태 변경'
				,top: true
				,bottom: true
				,width: '360px'
			}
			,is_modal3: false
			,modal_option3: {
				title: '첨부파일 삭제'
				,top: true
				,bottom: true
				,content: '해당 첨부파일을 삭제하시겠습니까?'
				,width: '360px'
			}
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
					,url: 'management/getAdmin'
					,data: {
						ATOKEN: this.TOKEN
						,uid: this.$route.params.idx
					}
				})
				if(result.success){
					this.item = result.data
					if(this.item.bank_info){
						this.item.bank_name = this.item.bank_info.split(' ')[0]
						this.item.bank_account = this.item.bank_info.split(' ')[1]
						this.item.holder_name = this.item.bank_info.split(' ')[2]
					}
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
					this.$router.back();
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
				const result = await this.Axios({
					method: 'post'
					,url: 'management/putAdmin'
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
		,isPassword: function(){
			this.clear()
			this.is_modal = true
		}
		,isStatus: function(){
			this.clear()
			this.is_modal2 = true
		}
		,clear: function(){
			this.is_modal = false
			this.is_modal2 = false
			this.is_modal3 = false
		}
		,toList: function(){
			this.$router.back()
		}

		,daumPost: function () {
			this.is_post = true
		}
		, addPost: function (call) {

			this.$set(this.item, 'shop_post', call.zonecode)
			this.$set(this.item, 'shop_addr1', call.address)

			this.is_post = false
		}
		,doPassword: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postPasswordReset'
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
</style>