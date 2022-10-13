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
			class="mt-10 pa-10 bg-white full-height"
		>
			<div
				v-if="item_list.length > 0"
			>
				<table class="table table-even">
					<colgroup>
						<col width="80px" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
						<col width="auto" />
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
							<td>{{ item.agency_name }}</td>
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
									@click="toDetail(item)"
									class="color-icon"
								>mdi mdi-arrow-right-bold-box-outline</v-icon>
							</td>
						</tr>
					</tbody>
				</table>

				<Pagination
					:program="program"
					:align="'center'"
					:options="search"

					@click="getSearch"
				></Pagination>
			</div>
			<Empty
				v-else
			></Empty>
		</div>

		<Excel
			v-if="is_excel"
			:excel_data="excel_data"
			:date="date"
		></Excel>

		<BackgroundModal
			v-if="is_item"
		>
			<template
				v-slot:contents
			>
				<MemberItem
					:Axios="Axios"
					:item_new="item_new"
					:admin_list="agency_list"
					:is_agency="is_agency"
					:rules="rules"
					:user="user"
					:codes="codes"
					:TOKEN="TOKEN"

					style="width: 320px; background-color: white"

					@click="getData"
					@cancel="onCancel"
				></MemberItem>
			</template>
		</BackgroundModal>
	</div>
</template>

<script>

	import Pagination from "../../components/Pagination";
	import Excel from "@/components/Excel";
	import Search from "@/view/Layout/Search";
	import Empty from "@/view/Layout/Empty";
	import MemberItem from "@/view/Member/MemberItem";
	import BackgroundModal from "@/components/BackgroundModal";

	export default {
		name: 'MemberList'
		, components: {MemberItem, Empty, Search, Excel, Pagination, BackgroundModal}
		, props: ['Axios', 'rules', 'TOKEN', 'user', 'date', 'codes']
		,data: function (){
			return {
				program: {
					name: '회원 목록'
					,top: true
					,title: true
				}
				,search: this.$storage.init({
					ATOKEN: this.TOKEN
					,search_type: ''
					,admin_code: ''
					,member_status: ''
					,list_cnt: 10
					, page: 1
				})
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
				}
				,items: [

				]
				,item_new: {
					ATOKEN: this.TOKEN
				}
				,agency_list: [

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
			,select_option_agency: function(){
				let list = []
				this.agency_list.filter(function(item){

					list.push({
						name: item.agency_name
						,column: item.uid
					})
				})

				return list
			}
		}
		,methods: {
			getData: async function(){

				this.is_item = false
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
						this.$storage.setQuery(this.search)
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
					this.is_excel = false
				}catch (e) {
					console.log(e)
				}
			}
			,getAgencyList: async function() {
				if(this.user.role != this.codes.type_code_admin && this.user.route != this.codes.type_code_distributor){
					return false
				}
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/getAgencyList'
						,data: this.search
					})

					if(result.success){
						this.agency_list = result.data.result
						//this.search_option.select[0].items = this.select_option_agency
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
			,toDetail: function (item){
				this.$storage.push({ name: 'MemberDetail', params: {idx: item.uid}, not_query: true})
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
						this.$bus.$emit('notify', { type: 'success', message: result.message })
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
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
						this.$bus.$emit('notify', { type: 'success', message: result.message })
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$bus.$emit('notify', { type: 'error', message: '통신 오류' })
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
			,getSearch: function(page){
				if(page){
					this.search.page = page
				}

				this.getData()
			}
			,do: async function(){
				await this.getAgencyList()

				await this.getData()
			}
			, onCancel: function(){
				if(confirm("회원가입을 취소하시겠습니까? 작성중인 정보는 저장되지 않습니다.")){
					this.is_item = false
				}
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.do()
		}
		,watch: {
		}
	}
</script>