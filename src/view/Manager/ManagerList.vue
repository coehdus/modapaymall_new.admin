<template>
	<div
		class="full-height flex-column"
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getSearch"
			@click="getSearch"
			@toItem="toItem"
		></Search>

		<div
			class="mt-10 pa-10 bg-white full-height full-width justify-space-between overflow-y-auto"
		>
			<div class="flex-column full-width  ">
				<div
					v-if="item_list.length > 0"
				>
					<table
						class="table table-even"
					>
						<colgroup>
							<col width="80px" />
							<col width="150px" />
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
									v-model="is_all"
									type="checkbox"
								/>
							</th>
							<th>등급</th>
							<th>아이디</th>
							<th>이름</th>
							<th>연락처</th>
							<th>사용여부</th>
							<th>등록일</th>
							<th>상세정보</th>
						</tr>
						</thead>
						<tbody>
						<tr
							v-for="item in item_list"
							:key="item.admin_id"
							:class="{ 'bg-select': item.uid == item_new.uid }"
						>
							<td>
								<input
									v-model="item.is_select"
									type="checkbox"
								/>
							</td>
							<td class="position-relative">

								<select
									v-model="item.admin_level"
									class="input-box position-relative cursor-pointer"
									style="z-index: 1"

									@change="item.is_select = true"
								>
									<option
										value="0"
									>등급을 선택하세요</option>
									<option
										v-for="level in codes.A002.items"
										:key="level.total_code"
										:value="level.code_value"
									>{{ level.code_name }}</option>
								</select>
								<v-icon
									class="position-absolute color-icon"
									style="right: 15px; top: 16px; z-index: 0"
								>mdi mdi-menu-down</v-icon>

							</td>
							<td>{{ item.account_id }}</td>
							<td>{{ item.admin_name }}</td>
							<td>{{ item.admin_phone }}</td>
							<td
								class="full-height "
							>
								<div
									class=" flex-row justify-center"
								>
									<v-icon
										class="pa-5 "
										:class="item.admin_status == 1 ? 'bg-green color-white' : 'btn-default' "
										@click="item.admin_status = 1; update(item)"
									>mdi mdi-account-check</v-icon>
									<v-icon
										class="pa-5  "
										:class="item.admin_status == 0 ? 'bg-red color-white' : 'btn-default' "
										@click="item.admin_status = 0; update(item)"
									>mdi mdi-account-off</v-icon>

									<v-icon
										class="pa-5 bg-red color-white ml-10"
										@click="confirmDelete(item)"
									>mdi mdi-delete-forever</v-icon>
								</div>
							</td>
							<td>{{ item.wDate }}</td>
							<td>
								<v-icon
									v-if="item.uid == item_new.uid"
									class="color-red"
									@click="toDetail(item)"
								>mdi mdi-close-box-outline</v-icon>
								<v-icon
									v-else
									@click="toDetail(item)"
									class="color-icon"
								>mdi mdi-arrow-right-bold-box-outline</v-icon>
							</td>
						</tr>
						</tbody>
					</table>
					<div
						class="pa-10 text-right"
					>
						<button
							class=" pa-5-10"
							:class="is_select ? 'btn-blue' : 'btn-blue-outline'"
						>선택 수정</button>
					</div>
				</div>
				<div
					v-else
					class="flex-column full-height justify-center bg-base "
				>
					<div class="text-center">
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

					@click="getSearch"
					class="mt-auto"
				></Pagination>
			</div>
		</div>
	</div>
</template>

<script>

import Pagination from "../../components/Pagination";
import Search from "@/view/Layout/Search";

export default {
	name: 'ManagerList'
	,
	components: {Search, Pagination},
	props: ['Axios', 'TOKEN', 'rules', 'codes']
	,data: function (){
		return {
			program: {
				name: '관리자 목록'
				,top: true
				,title: true
			}
			,is_all: false
			,options: {

			}
			,search: this.$storage.init({
				ATOKEN: this.TOKEN
				,page: 1
				,search_type: ''
				,search_value: ''
				,list_cnt: 10
				,admin_level: ''
				,admin_status: ''
			})
			,search_option:{

				is_item: true
				,is_cnt: true
				,cnt: 0
				,tCnt: 0
				,search_type: [
					{ name: '아이디', column: 'admin_id'}
					,{ name: '이름', column: 'admin_name'}
				]
				,select: [
					{ name: '등급', column: 'admin_level', items: [
							{ column: 99, name: '최고관리자'}
							,{ column: 90, name: '운영관리자'}
							,{ column: 50, name: '일반관리자'}
						]}
					, { name: '사용 여부', column: 'admin_status', items: [
							{ name: '사용', column: '1'}
							,{ name: '미사용', column: '0'}
						]
					}
				]
			}
			,is_item: false
			,items: [

			]
			,item_new: {

			}
			,levels: [
				{ code: 99, name: '최고관리자'}
				,{ code: 50, name: '일반관리자'}
			]
			,status: [
				{ code: 99, name: '최고관리자'}
				,{ code: 50, name: '일반관리자'}
			]
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
		,is_select: function(){
			let is = false
			this.items.filter(function(item){
				if(item.is_select){
					is = true
					return
				}
			})

			return is
		}
	}
	,methods: {
		getData: async function(){

			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getAdminList'
					,data: this.search
				})

				if(result.success){
					this.$storage.setQuery(this.search)
					this.items = result.data.result
					this.$set(this.search, 'total_count', result.data.tCnt)
					this.search_option.tCnt = result.data.tCnt
					this.search_option.cnt = result.data.cnt
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,getSearch: function(page){
			if(page){
				this.search.page = page
			}

			this.getData()
		}
		,save: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postAdmin'
					,data: this.item_new
				})

				if(result.success){
					await this.getSearch()
					this.clear_item()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
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
				,admin_level: 0
				,admin_type: 'admin'
			}
			this.is_item = false
		}
		,confirmDelete: function(item){
			if(confirm("삭제하시겠습니까?")){
				this.deleteItem(item)
			}
		}
		,deleteItem: async  function(item){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postAdminDelete'
					,data: item
				})

				if(result.success){
					await this.getSearch()
					this.clear_item()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
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
		,update: async function(item){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postAdminUpdate'
					,data: item
				})

				if(result.success){
					this.clear_item()
					await this.getSearch()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: e})
			}finally {
				this.$emit('offLoading')
			}
		}
		,toItem: function (){
			this.$storage.push({name: 'ManagerItem', not_query: true})
		}
		,toDetail: function(item){
			this.$storage.push({ name: 'ManagerDetail', params: { idx: item.uid}, not_query: true})
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.clear_item()
		this.getData()
	}
	,watch: {
		is_all:{
			handler: function(call){
				let self = this
				this.items.filter(function(item){
					self.$set(item, 'is_select', call)
				})
			}
		}
	}
}
</script>