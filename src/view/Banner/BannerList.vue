<template>
	<div
		class="full-height flex-column "
	>
		<Search
			:search="search"
			:option="search_option"

			@change="getData"
			@click="getData"
			@toItem="toItem"
		></Search>

		<div
			class="mt-10 pa-10 bg-white full-height overflow-y-auto"
		>
			<table
				v-if="items.length > 0"
				class="table"
			>
				<colgroup>
					<col width="80px" />
					<col width="120px" />
					<col width="auto" />
					<col width="180px" />
					<col width="120px" />
					<col width="180px" />
					<col width="180px" />
				</colgroup>
				<thead>
				<tr>
					<th><input type="checkbox" /></th>
					<th>타입</th>
					<th>제목</th>
					<th>내용</th>
					<th>사용여부</th>
					<th>등록일시</th>
					<th>관리</th>
				</tr>
				</thead>
				<tbody>
				<template
					v-for="(item) in items"
				>
					<tr
						:key="'banner_' + item.uid"
					>
						<td><input type="checkbox" /></td>
						<td>
							<select
								v-model="item.type"
								class="input-box"
								@change="isUpdate(item)"
							>
								<option value="">타입</option>
								<option value="main">메인</option>
								<option value="normal">일반</option>
							</select>
						</td>
						<td class="text-left">{{ item.banner_name }}</td>
						<td>
							<button
								class="box pa-5-10"
								@click="is_view == item.uid ? is_view = null : is_view = item.uid"
							>내용보기
								<v-icon
									v-if="is_view == item.uid "
									small
									class=" color-icon cursor-pointer"
								>mdi mdi-menu-up</v-icon>
								<v-icon
									v-else
									small
									class=" color-icon cursor-pointer"
								>mdi mdi-menu-down</v-icon>
							</button>
						</td>
						<td>
							<select
								v-model="item.is_use"
								class="input-box"
								@change="doUpdate(item)"
							>
								<option value="0">미사용</option>
								<option value="1">사용</option>
							</select>
						</td>
						<td>{{ item.wDate }}</td>
						<td>
							<button
								class="btn-success pa-5-10 ml-10"

								@click="toDetail(item)"
							>수정</button>
							<button
								class="btn-danger pa-5-10 ml-10"
								@click="isDelete(item)"
							>삭제</button>
						</td>
					</tr>

					<tr
						v-if="is_view == item.uid"
						:key="'banner_file_' + item.uid"
					>
						<td colspan="7" class="text-left bg-eee">
							<span
								v-for="file in item.files"
								:key="'file_' + file.uid"
								class="banner-img mr-10 vertical-middle"
							>
								<img
									:src="file.file_path"
								/>
							</span>
						</td>
					</tr>
				</template>
				</tbody>
			</table>
			<div
				v-else
				class="full-height flex-column justify-center"
			>
				<div class="text-center">
					<v-icon
						class="size-px-48 color-icon"
					>mdi mdi-cloud-off-outline</v-icon>
					<br/>
					<br/>
					<div class="font-weight-bold size-px-24">No Data</div>
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

		<Modal
			:is_modal="is_modal_delete"
			:option="modal_option_delete"

			@close="doClear"
		>
			<div
				slot="modal-bottom"
				class="justify-space-between"
			>
				<button
					class="btn bg-red color-eee"
					@click="doDelete"
				>삭제</button>
				<button
					class="btn bg-gray-light color-333"
					@click="doClear"
				>취소</button>
			</div>
		</Modal>

		<Modal
			:is_modal="is_modal_update"
			:option="modal_option_update"

			@close="doClear"
		>
			<template
				slot="modal-bottom"
			>
				<button
					class="btn bg-blue color-eee"
					@click="doUpdate(item_update)"
				>수정</button>
				<button
					class="btn bg-gray-light color-333"
					@click="doClear"
				>취소</button>
			</template>
		</Modal>
	</div>
</template>

<script>
import Search from "@/view/Layout/Search";
import Pagination from "@/components/Pagination";

import Modal from "@/components/Modal";

export default {
	name: 'BannerList'
	,
	components: {Modal, Pagination, Search },
	props: ['Axios', 'TOKEN', 'codes', 'rules']
	,data: function(){
		return {
			program: {
				name: '배너목록'
				,top: true
				,title: true
				,bottom: false
			}
			,search:{
				ATOKEN: this.TOKEN
				,list_cnt: 10
				,search_type: ''
				, page: 1
			}
			,search_option: {
				is_excel: false
				,is_item: true
				,is_cnt: true
				,sDate: false
				,eDate: false
				,cnt: 0
				,tCnt: 0
				,search_type: [
					{ name: '제목', column: 'title'}
				]
			}
			,items: [

			]
			,is_view: null
			,is_modal_delete: false
			,is_modal_update: false
			,modal_option_delete: {
				top: true
				,title: '배너 삭제'
				,content: '해당 배너를 삭제하시겠습니까?'
				,bottom: true
				,width: '380px'
				, slot_bottom: true
			}
			,modal_option_update: {
				top: true
				,title: '배너 변경'
				,content: '해당 배너를 메인 배너로 변경하시겠습니까?'
				,bottom: true
				,width: '380px'
				, slot_bottom: true
			}
			,item_update: null
			,item_delete: null
		}
	}
	,computed: {
		item_list: function(){
			return this.items.filter(function(item){

				return item
			})
		}
		,modal_btn: function(){
			let text = ''
			if(this.item_update){
				text = '수정'
			}else if(this.item_delete){
				text = '삭제'
			}

			return text
		}
	}
	,methods: {
		getData: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getBannerList'
					,data: this.search
				})
				if(result.success){
					console.log(result.data.result)
					this.items = result.data.result
					this.$set(this.search, 'total_count', result.data.tCnt)
					this.$set(this.search_option, 'tCnt', result.data.tCnt)
					this.$set(this.search_option, 'cnt', result.data.cnt)
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
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
		,toItem: function(){
			this.$router.push({ name: 'BannerItem' })
		}
		,toDetail: function(item){
			this.$router.push({ name: 'BannerDetail', params: { banner_uid: item.uid }})
		}
		,doClear: function(){
			this.is_modal_delete = false
			this.is_modal_update = false
			this.item_delete = null
			this.item_update = null
		}
		,doDelete: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postBannerDelete'
					,data: {
						ATOKEN: this.TOKEN
						,banner_uid: this.item_delete.uid
					}
				})

				if(result.success){
					this.doClear()
					await this.getData()
					this.$emit('setNotify', { type: 'success', message: result.message})
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,isDelete: function(item){
			this.is_modal_delete = true
			this.item_delete = item
		}
		,doUpdate: async function(item){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postBannerUpdate'
					,data: {
						ATOKEN: this.TOKEN
						,uid: item.uid
						,is_use: item.is_use
						,type: item.type
					}
				})

				if(result.success){
					this.doClear()
					await this.getData()
					this.$emit('setNotify', { type: 'success', message: result.message})
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,isUpdate: function(item){

			if(item.type == 'main') {
				this.is_modal_update = true
				this.item_update = item
			}else{
				this.doUpdate(item)
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>

<style>
	.banner-img { display: inline-block; max-width: 120px; overflow: hidden}
	.banner-img img { width: 100%; }
</style>