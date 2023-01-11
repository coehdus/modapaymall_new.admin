<template>
	<div
		class="full-height"
	>
		<div
			class="justify-space-between"
		>
			<div class="flex-1 mr-10 pa-10 bg-white">
				<table
					class="table"
				>

					<col width="120px" />
					<col width="auto" />

					<tbody>
						<tr>
							<th>배너 타입</th>
							<td>
								<select
									v-model="item.type"
									class="input-box pa-10"
								>
									<option value="">배너 타입</option>
									<option value="main">메인</option>
									<option value="normal">일반</option>
								</select>
							</td>
						</tr>
						<tr>
							<th>제목</th>
							<td>
								<input
									v-model="item.banner_name"
									class="input-box pa-10"
									placeholder="제목을 입력하세요"
								/>
							</td>
						</tr>
						<tr>
							<th>

								<span class="vertical-middle">배너 이미지</span>
								<v-icon
									class="color-blue ml-10 vertical-middle cursor-pointer"
									@click="addFiles"
								>mdi mdi-plus-box-outline</v-icon>
								<br/> 600 x 300
							</th>
							<td>
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
									:src="file.file_path"
								/>
									</span>
									<label
										class="flex-1 box pa-5 mr-10 text-left"
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
							</td>
						</tr>
					</tbody>
				</table>
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
			@click="deleteItem"
			@cancel="close"
		>
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
				const result = await this.$request.init({
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
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,save: async function(){
			this.$bus.$emit('on', true)

			this.item.files = JSON.stringify(this.files)
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postBannerModify'
					,data: this.item
				})

				if(result.success){
					await this.getData()
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
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
			this.$bus.$emit('on', true)

			try{
				const result = await this.$request.init({
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
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
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