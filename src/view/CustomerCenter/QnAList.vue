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
		>
			<select
				slot="add"
				v-model="search.b_answer"
				class="pa-5-10 mr-10"
				@change="getData"
			>
				<option value="">답변여부</option>
				<option value="n">답변대기</option>
				<option value="y">답변완료</option>
			</select>
		</Search>

		<div
			class="mt-10 pa-10 bg-white full-height flex-column overflow-y-auto"
		>
			<div
				v-if="items.length > 0"
			>
				<table class="table">
					<colgroup>
						<col width="80px" />
						<col width="auto" />
						<col width="180px" />
						<col width="120px" />
						<col width="120px" />
						<col width="180px" />
						<col width="180px" />
					</colgroup>
					<thead>
					<tr>
						<th><input type="checkbox" /></th>
						<th>제목</th>
						<th>내용</th>
						<th>아이디</th>
						<th>작성자</th>
						<th>등록일시</th>
						<th>관리</th>
					</tr>
					</thead>
					<tbody>
					<template
						v-for="(item) in item_list"
					>
						<tr
							:key="'bbs_' + item.uid"
						>
							<td><input type="checkbox" /></td>
							<td class="text-left">[<span :class="'color-' + item.is_answer_color">{{ item.is_answer_name }}</span>] {{ item.b_title }}</td>
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
							<td>{{ item.m_id }}</td>
							<td>{{ item.m_name }}</td>
							<td>{{ item.wDate }}</td>
							<td>
								<button
									class="btn-success pa-5-10 ml-10"

									@click="toDetail(item)"
								>답변하기</button>
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
							<td colspan="7" class="text-left bg-bbb ">
								<Viewer
									v-if="item.b_contents"
									:initialValue="item.b_contents"
								/>
							</td>
						</tr>
					</template>
					</tbody>
				</table>

				<Pagination
					:program="program"
					:align="'center'"
					:options="search"
				></Pagination>
			</div>

			<Empty
				v-else
			></Empty>

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
import Empty from "@/view/Layout/Empty";

export default {
	name: 'CustomerCenterQnAList'
	,
	components: {Empty, Modal, Pagination, Search,Viewer},
	props: ['Axios', 'TOKEN', 'codes', 'rules']
	,data: function(){
		return {
			program: {
				name: '1:1문의'
				,top: true
				,title: true
				,bottom: false
			}
			,search:{
				ATOKEN: this.TOKEN
				,b_code: 'b_qna'
				,list_cnt: 10
				,search_type: ''
				,b_answer: ''
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
					,{ name: '아이디', column: 'm_id'}
					,{ name: '이름', column: 'm_name'}
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
	,computed: {

		item_list: function(){
			return this.items.filter(function(item){
				if(item.b_answer){
					item.is_answer_color = 'green'
					item.is_answer_name = '답변 완료'
				}else{
					item.is_answer_color = ''
					item.is_answer_name = '답변 대기'
				}
				return item
			})
		}
	}
	,methods: {
		getData: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getBbsQnaList'
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
			this.$router.push({ name: 'BbsAnswer', params: { b_code: this.search.b_code, bbs_uid: item.uid }})
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