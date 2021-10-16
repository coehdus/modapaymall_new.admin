<template>
	<div
		class="full-height"
	>
		<div
			class="justify-space-between"
		>
			<div class="flex-1 mr-10">
				<div class="">
					<h6>배너 타입</h6>
					<select
						v-model="item.type"
						class="input-box"
					>
						<option value="">배너 타입</option>
						<option value="main">메인</option>
						<option value="normal">일반</option>
					</select>
				</div>
				<div class="mt-10">
					<h6>제목</h6>
					<input
						v-model="item.banner_name"
						class="input-box mt-10"
						placeholder="제목을 입력하세요"
					/>
				</div>
				<div class="mt-10">
					<h6>
						<span class="vertical-middle">배너 이미지</span>
						<v-icon
							class="color-blue ml-10 vertical-middle cursor-pointer"
							@click="addFiles"
						>mdi mdi-plus-box-outline</v-icon>
					</h6>

					<div
						v-for="(file, index) in file_items"
						:key="'file_' + index"
						class="justify-space-between mb-10"
					>
						<span
							v-if="file.uid"
							class="banner-img mr-10 "
						>
							<img
								:src="codes.banner_url + file.file_name"
							/>
								</span>
						<label
							class="flex-1 box pa-5 mr-10"
						>

							<v-icon
								class="color-icon"
							>mdi mdi-image</v-icon>
							{{ file.file_name }}
							<input
								v-show="false"
								type="file"
								placeholder="배너 이미지"
								class="input-box"
								maxlength="250"
								@change="setFile($event, index)"
								accept="image/*"
							/>
						</label>
						<span
							class="flex-1 mr-10"
						>
						<input
							v-model="file.banner_link"
							class=" box pa-5 full-width"
							placeholder="배너 링크"
						/></span>

						<span>
						<select
							v-model="file.is_out"
							class="box pa-5 mr-10"
						>
							<option value="0">내부 링크</option>
							<option value="1">외부 링크</option>
						</select>
						</span>
						<v-icon
							class="color-red"
							@click="is_delete(index)"
						>mdi mdi-close-box-outline</v-icon>
					</div>
				</div>
			</div>
			<div class="flex-1">
				<div class="">
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

			@close="close"
		>
			<div
				slot="modal-bottom"
				class="justify-space-between"
			>
				<button
					class="flex-1 pa-10 bg-red"
					@click="deleteItem"
				>삭제</button>
				<button
					class="flex-1 btn-default"
					@click="close"
				>취소</button>
			</div>
		</Modal>
	</div>
</template>


<script>

import Modal from "@/components/Modal";
export default {
	name: 'BbsItem'
	,props: ['Axios', 'user', 'codes', 'rules', 'TOKEN']
	,components: {Modal}
	,data: function(){
		return {
			program: {
				name: '배너 상세'
				,top: true
				,title: true
				,bottom: false
			}
			,item_board: {

			}
			,item: {
				ATOKEN: this.TOKEN
				,banner_name: ''
			}
			,files: [
				{ file: null, file_name: '파일을 선택하세요', link: '', is_out: '1'}
			]
			,item_delete: null
			,is_modal: false
			,modal_option: {
				top: true
				,title: '배너 이미지 삭제'
				,content: '해당 배너 이미지를 삭제하시겠습니까?'
				,bottom: true
				,width: '320px'
			}
		}
	}
	,computed: {
		file_items: function(){
			let index = 0
			return this.files.filter(function(item){
				if(!item.file_name){
					item.file_name = '파일을 선택하세요'
				}
				item.index = index
				index++
				return item
			})
		}
	}
	,methods: {
		getData: async function(){

			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getBannerInfo'
					,data: {
						ATOKEN: this.TOKEN
						,banner_uid: this.$route.params.banner_uid
					}
				})

				if(result.success){
					this.item = result.data
					this.item.ATOKEN = this.TOKEN
					this.files = result.data.files
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
		,save: async function(){
			this.$emit('onLoading')

			this.item.files = JSON.stringify(this.files)
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postBannerModify'
					,data: this.item
				})

				if(result.success){
					await this.getData()
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
		,setFile: function(e, index){

			let file = e.target.files[0]

			this.$set(this.item, 'banner_file' + index, file)
			this.$set(this.files[index], 'file_name', file.name)
		}
		,toBack: function(){
			this.$emit('goBack')
		}
		,addFiles: function(){
			this.files.push({
				file: null
				,file_name: ''
				,link: ''
				,is_out: 1
			})
		}
		,is_delete: function(index){
			this.item_delete = this.files[index]
			this.is_modal = true
		}
		,removeFile: function(index){
			if(this.files.length > 1){
				this.$delete(this.files, index)
				if(this.item['banner_file' + index]) {
					this.$delete(this.item['banner_file' + index])
				}
			}
		}
		,deleteItem: async function(){
			this.$emit('onLoading')

			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postBannerFileDelete'
					,data: {
						ATOKEN: this.TOKEN
						,banner_uid: this.$route.params.banner_uid
						,file_uid: this.item_delete.uid
					}
				})

				if(result.success){
					this.removeFile(this.item_delete.index)
					this.close()
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
		,close: function(){
			this.item_delete = null
			this.is_modal = false
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>

<style>

.banner-img { display: inline-block; max-width: 40px !important; overflow: hidden}
.banner-img img { width: 100%; }

</style>