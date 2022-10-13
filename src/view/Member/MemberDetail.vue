<template>
	<div class="full-height">
		<div
			class="justify-space-between full-height overflow-y-auto"
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
							{{ item.member_id }}
						</td>
						<th>소속</th>
						<td class="position-relative">
							<template
								v-if="user.role == codes.type_code_agency"
							>{{ item.agency_name }}</template>
							<template
								v-else
							>
							<select
								v-model="item.admin_code"
								class="input-box position-relative cursor-pointer"
								style="z-index: 1"
							>
								<option value="">선택하세요</option>
								<option
									v-for="(agency, index) in agency_list"
									:key="agency.uid + '_' + index"
									:value="agency.agency_id"
								>{{ agency.agency_name }}</option>
							</select>
							<v-icon
								class="position-absolute color-icon"
								style="right: 15px; top: 11px; z-index: 0"
							>mdi mdi-menu-down</v-icon>
							</template>
						</td>
					</tr>
					<tr>
						<th>이름 <span class="color-red">*</span></th>
						<td>
							<input
								type="text"
								v-model="item.member_name"
								maxlength="20"
								class="input-box full-width"
								placeholder="회원 이름을 입력하세요"
							/>
						</td>
						<th>비밀번호</th>
						<td class="">
							<button
								class="bg-blue-light pa-5-10"
								@click="isPassword"
							>비밀번호 초기화</button>
						</td>
					</tr>
					<tr>
						<th>휴대폰 번호</th>
						<td>
							<input
								type="number"
								v-model="item.member_tell"
								:ruels="[rules.max(item, 'member_tell', 12)]"
								class="input-box full-width"
								placeholder="회원 연락처를 입력하세요"
							/>
						</td>
						<th>계정상태</th>
						<td class="">
							<button
								v-for="(code, index) in codes.S003.items"
								:key="code.total_code + '_' + index"

								class="pa-5-10 mr-1"
								:class="item.member_status == code.code_value ? 'bg-' + code.code_color: 'bg-default'"
								@click="item.member_status = code.code_value "
							>{{ code.code_name }}</button>
						</td>
					</tr>
					<tr>
						<th>주소 <span class="color-red">*</span></th>
						<td colspan="3">

							<input
								v-model="item.member_post"

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
								v-model="item.member_addr1"

								class="input-box full-width mt-10" type="text" placeholder="주소"
								readonly

								@click="daumPost('company')"
							>
							<input
								v-model="item.member_addr2"

								class="input-box full-width mt-10" type="text" placeholder="상세주소를 입력하세요."
								maxlength="50"
							>
						</td>
					</tr>
					</tbody>
				</table>
			</div>

			<div class="flex-1 pa-10 full-height flex-column bg-white overflow-y-auto">
				<h6 class="under-line">
					<button
						class="pa-5-10 mr-10"
						:class="tab == 1 ? 'bg-identify' : 'bg-white'"
						@click="tab = 1"
					>최근 주문 내역</button>
					<button
						class="pa-5-10 mr-10"
						:class="tab == 2 ? 'bg-identify' : 'white'"
						@click="tab = 2"
					>배송지 목록</button>
					<button
						class="pa-5-10"
						:class="tab == 3 ? 'bg-identify' : 'white'"
						@click="tab = 3"
					>변경 이력</button>
				</h6>

				<div class="full-height flex-column overflow-y-auto">
					<div
						v-if="tab == 1"
						class="full-height"
					>
						<div
							v-if="order_list.length > 0"
						>
							<table class="table table-even"></table>
						</div>
						<Empty
							v-else
						></Empty>
					</div>
					<div
						v-else-if="tab == 2"
						class="full-height"
					>
						<div
							v-if="shipping_list.length > 0"
						>
							<table class="table table-even"></table>
						</div>

						<Empty
							v-else
						></Empty>
					</div>

					<div
						v-else
						class="full-height flex-column overflow-y-auto"
					>
						<div
							v-if="history_list.length > 0"
							class="full-height flex-column overflow-y-auto"
						>
							<table class="table">
								<col width="180px" />
								<col width="auto" />
								<col width="80px" />
								<tbody>
								<template
									v-for="(history, index) in items_history"
								>
									<tr
										:key="history.uid + '_' + index"
										@click="history.is_show = !history.is_show"
									>
										<td>{{ history.wDate }} {{ item.is_show }}</td>
										<td class="text-left">{{ history.history_type }}</td>
										<td><i class="mdi size-px-20 cursor-pointer" :class="history.is_show ? 'mdi-menu-up': 'mdi-menu-down'"></i></td>
									</tr>
									<tr
										v-if="history.is_show"
										:key="history.uid + '_history_' + index"
									>
										<td colspan="3" class="text-left">
											{{ history.history }}
										</td>
									</tr>
								</template>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div
			class="mt-10 justify-center"
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
import Empty from "@/view/Layout/Empty";
export default {
	name: 'MemberDetail'
	,
	components: {Empty, Modal, DaumPost},
	props: ['Axios', 'user', 'codes', 'rules', 'TOKEN']
	,data: function(){
		return {
			program: {
				name: '회원 상세정보'
				, top: true
				, title: true
				, bottom: false
			}
			,item: {

			}
			, tab: 1
			, agency_list: []
			, shipping_list: []
			, order_list: []
			, history_list: []
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
				title: '회원 계정상태 변경'
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
		items_history: function(){
			return this.history_list.filter((item) => {

				this.$set(item, 'is_show', false)
				return item
			})
		}
	}
	, methods: {
		getAgencyList: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getAgencyList2'
					,data: {
						ATOKEN: this.TOKEN
						,uid: this.$route.params.idx
						,agency_type: 'B003003'
					}
				})
				if(result.success){
					this.agency_list = result.data
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		, getData: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getMember'
					,data: {
						ATOKEN: this.TOKEN
						,uid: this.$route.params.idx
					}
				})
				if(result.success){
					this.item = result.data.member_info
					this.shipping_list = result.data.shipping_list
					this.history_list = result.data.history
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
				this.item.ATOKEN = this.TOKEN
				const result = await this.Axios({
					method: 'post'
					,url: 'management/putMember'
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

			this.$set(this.item, 'member_post', call.zonecode)
			this.$set(this.item, 'member_addr1', call.address)

			this.is_post = false
		}
		,doPassword: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postMemberPasswordReset'
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
		, do: async function(){
			await this.getAgencyList();

			await this.getData();
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