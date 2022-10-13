<template>
	<div
		class="full-height"
	>
		<div
			class="justify-space-between"
		>
			<div class="flex-1 mr-10 pa-10 bg-white">
				<div class="">
					<h6>제목</h6>
					<input
						v-model="item.b_title"
						class="input-box mt-10"
						placeholder="제목을 입력하세요"
						/>
				</div>
				<div class="mt-10">
					<h6>첨부파일</h6>


					<label class="mt-10 input-box">
					<v-icon
						class="color-icon"
					>mdi mdi-image</v-icon>
						{{ file_name }}
					<input
						v-show="false"
						type="file"
						placeholder="대표 이미지"
						class="input-box"
						maxlength="250"
						@change="setFile"
						accept="image/*"
					/>
					</label>
				</div>
			</div>
			<div class="flex-1 pa-10 bg-white">
				<div class="">

					<h6>내용</h6>
					<editor
						height="550px"
						initialEditType="wysiwyg"
						ref="b_contents"
						class="text-left mt-10"
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
	</div>
</template>


<script>
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';
	export default {
		name: 'BbsItem'
		,props: ['Axios', 'user', 'codes', 'rules', 'TOKEN']
		,components: {
			editor: Editor
		}
		,data: function(){
			return {
				program: {
					name: '게시글 작성'
					,top: true
					,title: true
					,bottom: false
				}
				,item_board: {

				}
				,item: {
					b_title: ''
					,b_contents: ''
					,b_file: null
					,m_name: ''
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
			getData: async function(){

			}
			,save: async function(){
				this.$emit('onLoading')

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
		}
		,created() {
			this.$emit('onLoad', this.program)
		}
	}
</script>

<style>
	.flex-title { flex: 0 0 120px; align-items: center}
	label { display: inline-block}
</style>