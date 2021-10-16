<template>
	<div
		class="full-height flex-column"
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getData"
			@click="getData"
			@toExcel="toExcel"
			@toItem="toItem"
		></Search>

		<div
			class="mt-10 full-height full-width justify-space-between overflow-y-auto"
		>
			<div class="full-width">
				<table
					v-if="item_list.length > 0"
				>
					<colgroup>
						<col width="80px" />
						<col width="150px" />
						<col width="150px" />
						<col width="150px" />
						<col width="150px" />
						<col width="auto" />
						<col width="180px" />
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
							<th>사용여부</th>
							<th>가입일</th>
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
							<td>{{ item.member_phone }}</td>
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
							<td>{{ item.join_date }}</td>
							<td>
								<v-icon
									v-if="item.uid == item_new.uid"
									class="color-red"
									@click="setItem(item)"
								>mdi mdi-close-box-outline</v-icon>
								<v-icon
									v-else
									@click="setItem(item)"
									class="color-icon"
								>mdi mdi-arrow-right-bold-box-outline</v-icon>
							</td>
						</tr>
					</tbody>
				</table>

				<div
					v-else
					class="flex-column justify-center "
				>
					<table
						class=""
					>
						<colgroup>
							<col width="80px" />
							<col width="150px" />
							<col width="150px" />
							<col width="150px" />
							<col width="150px" />
							<col width="auto" />
							<col width="180px" />
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
					</table>
					<div class="pa-50 text-center bg-base under-line">
						<v-icon
							class="size-px-48 color-gray"
						>mdi-cloud-off-outline</v-icon>
						<p class="mt-10 size-px-16 color-gray">조회된 내역이 없습니다.</p>
					</div>
				</div>

				<Pagination
					:program="program"
					:align="'center'"
					:options="search"
				></Pagination>
			</div>
			<SideB
				v-if="is_item"
				:title="'회원 정보'"
				:bg-title="'bg-' + (item_new.uid ? (item_new.member_status == 1 ? 'green' : 'red') : '')"
				@click="clear_item"
			>
				<template
					slot="item"
					class="flex-column overflow-y-auto "
				>
					<MemberItem
						:item_new="item_new"
						:rules="rules"
						:admin_list="admin_list"

						@click="save"
						class=""
					></MemberItem>
				</template>
			</SideB>
		</div>

		<Excel
			v-if="is_excel"
			:excel_data="excel_data"
			:date="date"
		></Excel>
	</div>
</template>

<script>
	import SideB from "../Layout/SideB";
	import Pagination from "../../components/Pagination";
	import Excel from "@/components/Excel";
	import MemberItem from "@/view/Member/MemberItem";
	import Search from "@/view/Layout/Search";
	export default {
		name: 'MemberList'
		,
		components: {Search, MemberItem, Excel, Pagination, SideB},
		props: ['Axios', 'rules', 'TOKEN', 'user', 'date']
		,data: function (){
			return {
				program: {
					name: '회원 목록'
					,top: true
					,title: true
				}
				,search: {
					ATOKEN: this.TOKEN
					,search_type: ''
					,admin_code: ''
					,member_status: ''
					,list_cnt: 10
				}
				,search_option:{
					is_excel: true
					,is_item: true
					,is_cnt: true
					,cnt: 0
					,tCnt: 0
					,search_type: [
						{ name: '아이디', column: 'member_id'}
						,{ name: '이름', column: 'member_name'}
					]
					,select: [
						{ name: '소속 대리점', column: 'admin_code', items: []}
						, { name: '사용 여부', column: 'member_status', items: [
								{ name: '사용', column: '1'}
								,{ name: '미사용', column: '0'}
							]
						}
					]
				}
				,items: [

				]
				,item_new: {
					ATOKEN: this.TOKEN
				}
				,admin_list: [

				]
				,is_excel: false
				,excel_data: {
					name: '회원목록'
					,header: [
						{ key: 0, name: '소속 대리점', column: 'admin_name'}
						,{ key: 0, name: '아이디', column: 'member_id'}
						,{ key: 0, name: '이름', column: 'member_name'}
						,{ key: 0, name: '연락처', column: 'member_phone'}
						,{ key: 0, name: '가입일', column: 'join_date'}
					]
					,content: null
				}
				,is_item : false
			}
		}
		,computed: {
			item_list: function (){
				return this.items.filter(function(item){

					return item
				})
			}
			,is_agency: function(){
				if(this.user.admin_type == 'agency'){
					return true
				}else{
					return false
				}
			}
			,select_option_admin: function(){
				let list = []
				this.admin_list.filter(function(item){

					list.push({
						name: item.admin_name
						,column: item.admin_id
					})
				})

				return list
			}
		}
		,methods: {
			getData: async function(){

				try{
					const result = await this.Axios({
						method: 'get'
						,url: 'management/getMemberList'
						,data: this.search
					})

					if(result.success){
						this.items = result.data.result
						this.$set(this.search, 'total_count', result.data.tCnt)
						this.search_option.tCnt = result.data.tCnt
						this.search_option.cnt = result.data.cnt
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
					this.is_excel = false
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
						this.search_option.select[0].items = this.select_option_admin
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
					this.is_item = true
				}
			}
			,clear_item: function(){
				this.item_new = {
					ATOKEN: this.TOKEN
					,admin_code: this.user.admin_type == 'agency' ? this.user.admin_id : ''
				}
				this.is_item = false
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
			,toExcel: function(){
				this.excel_data.content = this.items
				this.is_excel = true
			}
			,toItem: function (){
				this.is_item = !this.is_item
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.clear_item()
			this.getData()
			this.getAdminList()
		}
		,watch: {
			'search.page': {
				handler: function(){
					this.getData()
				}
			}
		}
	}
</script>