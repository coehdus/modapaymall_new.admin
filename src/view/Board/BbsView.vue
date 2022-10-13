<template>
	<div
		class="full-height"
	>
		<div
			class=" justify-space-between"
		>
			<div class="flex-1 mr-10 pa-10 bg-white flex-column">
				<div class="justify-space-between">
					<h6 class="font-weight-bold ">{{ item.b_title }}</h6>
					<div class="mt-10">{{ item.wDate }}</div>
				</div>
				<div class="mt-10">
					<Viewer
						v-if="item.b_contents"
						:initialValue="item.b_contents"
						class="pa-10 bg-gray-light"
					/>
				</div>
				<div class="mt-10">
					<h6>첨부파일</h6>
					<div>
						{{ file_name }}
					</div>
				</div>
			</div>
			<div class="flex-1 pa-10 ">

			</div>
		</div>

		<div class="mt-auto text-center">
			<button
				class="pa-10 box btn-gray"
				@click="toList"
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

import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from "@toast-ui/vue-editor";

import Modal from "@/components/Modal";
export default {
	name: 'BbsView'
	,props: ['Axios', 'user', 'codes', 'rules', 'TOKEN']
	,components: { Modal, Viewer }
	,data: function(){
		return {
			program: {
				name: '게시글 상세'
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
			let name = '-'
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
					this.$bus.$emit('notify', { type: 'error', message: result.message })
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
					this.$bus.$emit('notify', { type: 'error', message: result.message })
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
						,m_name: this.user.admin_name
					}
				})

				if(result.success){
					this.toBack()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
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
					this.$bus.$emit('notify', { type: 'success', message: result.message})
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		, do: async function(){
			await this.getConfigData()
			await this.getData()
		}
		, toList: function(){
			let b_code = this.item_config.b_code.replace('b_', '',  )
			let name = 'CustomerCenter' +  b_code.charAt(0).toUpperCase() + b_code.slice(1) + 'List'

			this.$storage.push({ name: name, not_query: true})
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.do()
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