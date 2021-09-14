<template>
	<div
		class="full-height"
	>
		<div
			class="justify-space-between"
		>
			<div class="flex-1 mr-20">
				<div class="">
					<h6>제목</h6>
					<div class="input-box">{{ item.b_title }}</div>
				</div>
				<div class="mt-10">
					<h6>내용</h6>
					<div
					>
						<Viewer
							v-if="item.b_contents"
							:initialValue="item.b_contents"
							class="pa-10 bg-gray-light box-conents-for-answer"
						/>
					</div>
				</div>
				<div class="mt-10">
					<h6>첨부파일</h6>
					<div class="mt-10">
						<button
							v-for="file in files"
							:key="'file_' + file.uid"
							class="mr-10 box pa-10"
						><v-icon
							class="color-icon mr-10"
						>mdi mdi-file</v-icon>{{ file.original_name }} <v-icon class="color-icon" >mdi mdi-arrow-down-bold-box-outline</v-icon></button>
					</div>
				</div>
			</div>
			<div class="flex-1">
				<div class="">
					<h6>답변</h6>
					<editor
						height="550px"
						initialEditType="wysiwyg"
						ref="b_answer"
						class="text-left "
					/>
				</div>
			</div>
		</div>

		<div class="mt-30 text-center">
			<button
				class="pa-10 box btn-blue mr-10"
				@click="save"
			>저장</button>
			<button
				class="pa-10 box btn-gray"
				@click="$emit('goBack')"
			>목록 </button>
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
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';

import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from "@toast-ui/vue-editor";

import Modal from "@/components/Modal";
export default {
	name: 'BbsDetail'
	,props: ['Axios', 'member_info', 'codes', 'rules', 'TOKEN']
	,components: { Modal, editor: Editor ,Viewer }
	,data: function(){
		return {
			program: {
				name: '1:1문의 '
				,top: true
				,title: true
				,bottom: false
			}
			,item: {
				b_title: ''
				,b_contents: ''
				,b_file: null
				,m_name: ''
			}
			,item_config: {

			}
			,files: []
			,file_delete: null
			,is_modal: false
			,modal_option: {
				top: true
				,title: '첨부파일 삭제'
				,content: '해당 첨부파일을 삭제하시겠습니까?'
				,bottom: true
				,width: '380px'
			}
		}
	}
	,computed: {
		file_name: function(){
			let name = '첨부파일'
			if(this.item.b_file){
				name = this.item.b_file.name
			}
			return name
		}
	}
	,methods: {
		getConfigData: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getBoardConfig'
					,data: {
						ATOKEN: this.TOKEN
						,b_code: this.$route.params.b_code
					}
				})

				if(result.success){
					this.item_config = result.data
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,getData: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getbbs'
					,data: {
						ATOKEN: this.TOKEN
						,bbs_uid: this.$route.params.bbs_uid
						,b_code: this.$route.params.b_code
					}
				})

				if(result.success){
					this.item = result.data.result
					this.files = result.data.files
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,save: async function(){
			this.$emit('onLoading')

			console.log(this.member_info)
			let b_contents = this.$refs.b_contents.invoke("getMarkdown")

			if(!b_contents){
				this.$refs.b_contents.invoke("setMarkdown", this.item.b_contents)
			}

			this.item.b_contents = b_contents

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postBbs'
					,data: {
						ATOKEN: this.TOKEN
						,uid: this.$route.params.bbs_uid
						,b_code: this.$route.params.b_code
						,b_title: this.item.b_title
						,b_contents: b_contents
						,b_file: this.item.b_file
						,m_name: this.member_info.admin_name
					}
				})

				if(result.success){
					this.toBack()
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,setFile: function(e){
			let file = e.target.files[0]
			console.log(file)
			this.$set(this.item, 'b_file', file)
		}
		,toBack: function(){
			this.$emit('goBack')
		}
		,isDelete: function(file){
			this.file_delete = file
			this.is_modal = true
		}
		,doClear: function(){
			this.is_modal = false
			this.file_delete = null
		}
		,doDelete: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postBbsFileDelete'
					,data: {
						ATOKEN: this.TOKEN
						,bbs_uid: this.item.uid
						,b_code: this.$route.params.b_code
						,file_uid: this.file_delete.uid
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
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
		this.getConfigData();
	}
}
</script>

<style>
.flex-title { flex: 0 0 120px; align-items: center}
label { display: inline-block}
.box-conents-for-answer {
	min-height: 250px;
	max-height: 550px;
	overflow: auto
}
</style>