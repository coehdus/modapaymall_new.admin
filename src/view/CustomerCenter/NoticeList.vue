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
			class="mt-10 full-height flex-column overflow-y-auto"
		>
			<table
				v-if="items.length > 0"
			>
				<colgroup>
					<col width="80px" />
					<col width="auto" />
					<col width="180px" />
					<col width="180px" />
					<col width="180px" />
				</colgroup>
				<thead>
					<tr>
						<th><input type="checkbox" /></th>
						<th>제목</th>
						<th>내용</th>
						<th>등록일시</th>
						<th>관리</th>
					</tr>
				</thead>
				<tbody>
					<template
						v-for="(item) in items"
					>
						<tr
							:key="'bbs_' + item.uid"
						>
							<td><input type="checkbox" /></td>
							<td class="text-left">{{ item.b_title }}</td>
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
							:key="'bbs_contents_' + item.uid"
						>
							<td colspan="5" class="text-left bg-bbb ">
								<Viewer
									v-if="item.b_contents"
									:initialValue="item.b_contents"
								/>
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
			></Pagination>
		</div>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"

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
	</div>
</template>

<script>
	import Search from "@/view/Layout/Search";
	import Pagination from "@/components/Pagination";

	import '@toast-ui/editor/dist/toastui-editor-viewer.css';
	import { Viewer } from "@toast-ui/vue-editor";
	import Modal from "@/components/Modal";

	export default {
		name: 'CustomerCenterNoticeList'
		,
		components: {Modal, Pagination, Search,Viewer},
		props: ['Axios', 'TOKEN', 'codes', 'rules']
		,data: function(){
			return {
				program: {
					name: '공지사항'
					,top: true
					,title: true
					,bottom: false
				}
				,search:{
					TOKEN: this.TOKEN
					,b_code: 'b_notice'
					,is_ajax: true
					,list_cnt: 10
					,search_type: ''
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
				,is_modal: false
				,modal_option: {
					top: true
					,title: '게시글 삭제'
					,content: '해당 게시글을 삭제하시겠습니까?'
					,bottom: true
					,width: '380px'
				}
			}
		}
		,methods: {
			getData: async function(){
				this.$emit('onLoading')
				try{
					const result = await this.Axios({
						method: 'get'
						,url: 'board/getBbsList'
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
			,toItem: function(){
				this.$router.push({ name: 'BbsItem', params: { b_code: this.search.b_code}})
			}
			,toDetail: function(item){
				this.$router.push({ name: 'BbsDetail', params: { b_code: this.search.b_code, bbs_uid: item.uid }})
			}
			,doClear: function(){
				this.is_modal = false
				this.item_delete = null
			}
			,doDelete: async function(){
				this.$emit('onLoading')
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'management/postBbsDelete'
						,data: {
							ATOKEN: this.TOKEN
							,bbs_uid: this.item_delete.uid
							,b_code: this.$route.params.b_code
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
				this.is_modal = true
				this.item_delete = item
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>