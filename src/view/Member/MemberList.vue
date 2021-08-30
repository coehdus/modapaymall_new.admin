<template>
	<div
		class="full-height justify-space-between"
	>
		<div
			class="full-height full-width flex-column"
		>
			<table>
				<colgroup>
					<col width="80px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="150px" />
					<col width="auto" />
					<col width="150px" />
				</colgroup>
				<thead>
					<tr>
						<th>
							<input
								type="checkbox"
							/>
						</th>
						<th>소속 대리점</th>
						<th>아이디</th>
						<th>이름</th>
						<th>연락처</th>
						<th>가입일</th>
						<th>사용여부</th>
						<th>상세정보</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="item in item_list"
						:key="item.uid"
						:class="{ 'bg-select': item.uid == item_new.uid }"
					>
						<td>
							<input
								type="checkbox"
							/>
						</td>
						<td>{{ item.admin_name }}</td>
						<td>{{ item.member_id }}</td>
						<td>{{ item.member_name }}</td>
						<td>{{ item.member_tell }}</td>
						<td>{{ item.join_date }}</td>
						<td
							class="full-height"
						>
							<div
								class=" flex-row justify-center"
							>
								<v-icon
									class="pa-5"
									:class="item.member_status == 1 ? 'bg-green color-white' : 'btn-default' "
									@click="item.member_status = 1; update(item)"
								>mdi mdi-account-check</v-icon>
								<v-icon
									class="pa-5 "
									:class="item.member_status != 1 ? 'bg-red color-white' : 'btn-default' "
									@click="item.member_status = 0; update(item)"
								>mdi mdi-account-off</v-icon>

								<v-icon
									class="pa-5 bg-red color-white ml-10"
									@click="confirmDelete(item)"
								>mdi mdi-delete-forever</v-icon>
							</div>
						</td>
						<td
						>
							<v-icon
								v-if="item.uid == item_new.uid"
								class="color-red"
								@click="setItem(item)"
							>mdi mdi-close-box-outline</v-icon>
							<v-icon
								v-else
								@click="setItem(item)"
							>mdi mdi-arrow-right-bold-box-outline</v-icon>
						</td>
					</tr>
				</tbody>
			</table>

			<div
				class="mt-auto"
			>
				<Pagination
					:program="program"
					:align="'center'"
					:options="options"
				></Pagination>
			</div>
		</div>
		<SideB
			:title="'회원 정보'"
			:bg-title="'bg-' + (item_new.uid ? (item_new.member_status == 1 ? 'green' : 'red') : '')"
		>
			<div
				slot="item"
			>
				<div class="pa-10">
					<div class="mt-10 position-relative">
						<select
							v-model="item_new.admin_code"
							class="input-box"
							:disabled="is_agency"
						>
							<option
								:value="''"
							>소속 대리점</option>
							<option
								v-for="admin in admin_list"
								:key="admin.admin_id"
								:value="admin.admin_id"
							>{{ admin.admin_name }}</option>
						</select>
						<v-icon
							class="position-absolute"
							style="right: 10px; top: 10px;"
						>mdi mdi-menu-down</v-icon>
					</div>
					<div class="mt-10">
						<div
							v-if="item_new.uid"
							class="input-box bg-gray-light"
						>{{ item_new.member_id }}</div>
						<input
							v-else
							v-model="item_new.member_id"
							placeholder="아이디"
							class="input-box"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.member_name"
							placeholder="이름"
							class="input-box"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.member_phone"
							type="number"
							placeholder="연락처"
							class="input-box"
							:rules="[rules.max(item_new, 'admin_phone', 15)]"
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.member_email"
							type="email"
							placeholder="이메일"
							class="input-box"
						/>
					</div>
					<div class="mt-10 justify-space-between">
						<input
							v-model="item_new.member_post"
							placeholder="우편번호"
							class="input-box mr-10"
							readonly
						/>
						<button
							class="btn btn-identify"
						>주소찾기</button>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.member_addr1"
							placeholder="주소"
							class="input-box"
							readonly
						/>
					</div>
					<div class="mt-10">
						<input
							v-model="item_new.member_addr2"
							placeholder="상세주소"
							class="input-box"
						/>
					</div>
					<div
						v-if="false"
						class="mt-10"
					>
						<button
							class="btn btn-identify"
						>비밀번호 변경</button>
					</div>
					<div
						v-else
						class="mt-10"
					>
						<input
							v-model="item_new.member_password"
							type="password"
							placeholder="비밀번호"
							class="input-box"
							maxlength="25"
						/>
						<input
							v-model="item_new.member_password_confirm"
							type="password"
							placeholder="비밀번호 확인"
							class="input-box mt-10"
							maxlength="25"
						/>
					</div>
					<div class="mt-10">
						<button
							class="btn btn-identify"
							@click="save"
						>{{ btn_name }}</button>
					</div>
				</div>
			</div>
		</SideB>
	</div>
</template>

<script>
	import SideB from "../Layout/SideB";
	import Pagination from "../../components/Pagination";
	export default {
		name: 'MemberList'
		,
		components: {Pagination, SideB},
		props: ['Axios', 'rules', 'TOKEN', 'member_info']
		,data: function (){
			return {
				program: {
					name: '회원 목록'
					,top: true
					,title: true
				}
				,search: {
					ATOKEN: this.TOKEN
				}
				,items: [

				]
				,item_new: {
					ATOKEN: this.TOKEN
				}
				,options: {

				}
				,admin_list: {

				}
			}
		}
		,computed: {
			item_list: function (){
				return this.items.filter(function(item){

					return item
				})
			}
			,btn_name: function (){
				if(this.item_new.uid){
					return '저장'
				}else{
					return '신규 등록'
				}
			}
			,is_agency: function(){
				if(this.member_info.admin_type == 'agency'){
					return true
				}else{
					return false
				}
			}
		}
		,methods: {
			getData: async function(){

				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getMemberList'
						,data: this.search
					})

					if(result.success){
						this.items = result.data.result
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,getAdminList: async function() {
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getAgencyList'
						,data: this.search
					})

					if(result.success){
						this.admin_list = result.data.result
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,save: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/postMember'
						,data: this.item_new
					})

					if(result.success){
						await this.getData()
						this.clear_item()
						this.$emit('setNotify', { type: 'success', message: result.message })
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$emit('setNotify', { type: 'error', message: '통신 오류' })
				}
			}
			,setItem: function (item){
				if(this.item_new.uid == item.uid){
					this.clear_item()
				}else {
					this.item_new = item
				}
			}
			,clear_item: function(){
				this.$set(this, 'item_new', {
					ATOKEN: this.TOKEN
					,admin_code: this.member_info.admin_type == 'agency' ? this.member_info.admin_id : ''
				})
			}
			,confirmDelete: function(item){
				if(confirm("삭제하시겠습니까?")){
					this.deleteItem(item)
				}
			}
			,deleteItem: async  function(item){

				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/postMemberDelete'
						,data: item
					})

					if(result.success){
						await this.getData()
						this.clear_item()
						this.$emit('setNotify', { type: 'success', message: result.message })
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$emit('setNotify', { type: 'error', message: '통신 오류' })
				}
			}
			,update: async function(item){

				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/postMemberUpdate'
						,data: item
					})

					if(result.success){
						this.clear_item()
						this.$emit('setNotify', { type: 'success', message: result.message })
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$emit('setNotify', { type: 'error', message: '통신 오류' })
				}finally {
					await this.getData()
				}
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.clear_item()
			this.getData()
			this.getAdminList()
		}
	}
</script>