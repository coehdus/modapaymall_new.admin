<template>
	<div
		class="full-height"
	>
		<div
			class="justify-space-between"
		>
			<div class="flex-1 mr-10">
				<div class=" bg-white pa-10">
					<h6>배너 타입</h6>
					<select
						v-model="item.type"
						class="input-box"
					>
						<option value="">배너타입</option>
						<option value="main">메인</option>
						<option value="normal">일반</option>
					</select>
				</div>
				<div class="mt-10  bg-white pa-10">
					<h6>제목</h6>
					<input
						v-model="item.banner_name"
						class="input-box mt-10"
						placeholder="제목을 입력하세요"
					/>
				</div>
				<div class="mt-10 bg-white pa-10">
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
						<input
							v-model="file.banner_link"
							class="flex-1 box pa-5 mr-10"
							placeholder="배너 링크"
						/>
						<select
							v-model="file.is_out"
							class="box pa-5 mr-10"
						>
							<option value="0">외부 링크</option>
							<option value="1">내부 링크</option>
						</select>
						<v-icon
							class="color-red"
							@click="removeFile(index)"
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
	</div>
</template>


<script>

export default {
	name: 'BbsItem'
	,props: ['Axios', 'user', 'codes', 'rules', 'TOKEN']
	,components: {}
	,data: function(){
		return {
			program: {
				name: '배너 등록'
				,top: true
				,title: true
				,bottom: false
			}
			,item_board: {

			}
			,item: {
				ATOKEN: this.TOKEN
				,banner_name: ''
				,type: 'main'
			}
			,files: [
				{ file: null, file_name: '파일을 선택하세요', link: '', is_out: '1'}
			]
		}
	}
	,computed: {
		file_items: function(){
			return this.files.filter(function(item){
				if(!item.file_name){
					item.file_name = '파일을 선택하세요'
				}
				return item
			})
		}
	}
	,methods: {
		getData: async function(){

		}
		,save: async function(){
			this.$emit('onLoading')

			this.item.files = JSON.stringify(this.files)
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postBanner'
					,data: this.item
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
				,banner_link: ''
				,is_out: 1
			})
		}
		,removeFile: function(index){
			if(this.files.length > 1){
				this.$delete(this.files, index)
				this.$delete(this.item['banner_file' + index])
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		console.log('typeof : ' +  typeof this.files)
	}
}
</script>

<style>
.flex-title { flex: 0 0 120px; align-items: center}
label { display: inline-block}
</style>