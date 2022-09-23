<template>
	<div
		slot="item"
		class="flex-column overflow-y-auto"
	>
		<div
			class="justify-space-between"
		>
			<div class="flex-1 mr-10 pa-10 bg-white">
				<table class="table th-left">
					<col width="120px" />
					<col width="auto" />
					<tbody>
						<tr>
							<th>공급사</th>
							<td>
								<div class="position-relative">
									<select
										v-model="item.pdt_company"
										class="input-box "
										:disabled="is_supply"
									>
										<option
											:value="''"
										>공급사</option>
										<template
											v-for="supply in supply_list"
										>
											<option
												:key="supply.supply_id"
												:value="supply.supply_id"
											>{{ supply.supply_name }}</option>
										</template>
									</select>
									<v-icon
										class="position-absolute color-icon"
										style="right: 10px; top: 2px;"
									>mdi mdi-menu-down</v-icon>
								</div>
							</td>
						</tr>
						<tr>
							<th>카테고리</th>
							<td>
								<div class="mt-10 position-relative">
									<select
										v-model="item.pdt_category"
										class="input-box"
									>
										<option
											:value="''"
										>카테고리</option>
										<option
											v-for="category in category_list"
											:key="category.category_code"
											:value="category.category_code"
										>{{ category.category_name }}</option>
									</select>
									<v-icon
										class="position-absolute color-icon"
										style="right: 10px; top: 2px;"
									>mdi mdi-menu-down</v-icon>
								</div>
							</td>
						</tr>
						<tr>
							<th>상품명</th>
							<td>
								<input
									v-model="item.pdt_name"
									placeholder="상품명"
									class="input-box"
									maxlength="25"
								/>
							</td>
						</tr>
						<tr>
							<th>공급가</th>
							<td>
								<input
									v-model="item.pdt_purchase"
									type="number"
									placeholder="공급가"
									class="input-box"
									:rules="[rules.max(item, 'pdt_purchase', 10)]"
								/>
							</td>
						</tr>
						<tr>
							<th>판매가</th>
							<td>
								<input
									v-model="item.pdt_price"
									type="number"
									placeholder="판매가"
									class="input-box"
									:rules="[rules.max(item, 'pdt_price', 10)]"
								/>
							</td>
						</tr>
						<tr>
							<th>개별 배송비</th>
							<td>
								<input
									v-model="item.pdt_delivery"
									type="number"
									placeholder="개별 배송비"
									class="input-box"
									:rules="[rules.max(item, 'pdt_dis_delivery', 10)]"
								/>
							</td>
						</tr>
						<tr>
							<th>한줄 설명</th>
							<td>
								<input
									v-model="item.pdt_summary"
									placeholder="한줄 설명"
									class="input-box"
									maxlength="250"
								/>
							</td>
						</tr>
						<tr>
							<th>대표 이미지</th>
							<td>
								<label
									class="box pa-10 justify-space-between "
								>
									{{ main_img_name }}

									<v-icon
										class="color-icon"
									>mdi mdi-image</v-icon>
									<input
										v-show="false"
										type="file"
										placeholder="대표 이미지"
										class="input-box"
										maxlength="250"
										@change="setMainImg"
										accept="image/*"
									/>
								</label>
							</td>
						</tr>
						<tr>
							<th>상품 이미지</th>
							<td>
								<label
									class="box pa-10 justify-space-between"
								>
									{{ sub_img_name }}
									<v-icon
										class="color-icon"
									>mdi mdi-image</v-icon>
									<input
										v-show="false"
										type="file"
										placeholder="상품 이미지"
										class="input-box"
										maxlength="250"
										@change="setSubImg"
										multiple
										accept="image/*"
									/>
								</label>
							</td>
						</tr>
						<tr>
							<th>
								상품 옵션 <v-icon
								small
								class="box color-green "
								@click="addOption"
							>mdi mdi-plus</v-icon>
							</th>
							<td class="text-left">
								<div class="pa-10 box color-red">
									옵션 내용은 콤마(,)로 구분합니다 ex) 사이즈: s,m,l,xl,xxl
								</div>
								<div class="mt-10">
									<ul>
										<li
											v-for="(option, index) in item_options.option"
											:key="'option_' + option.uid"
											class="mb-10"
										>
											<input
												v-model="option.opt_name"
												class="box pa-10 mr-10"
												placeholder="옵션명"
											>
											<input
												v-model="option.opt_cont"
												class="box pa-10 mr-10"
												placeholder="옵션 내용"
											>
											<v-icon

												class="box pa-5 color-red "
												@click="removeOption(option, index)"
											>mdi mdi-close</v-icon>
										</li>
									</ul>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="flex-1 prl-10 pa-10 bg-white ">

				<table class="table td-left">
					<col width="120px" />
					<col width="auto" />
					<tbody>
					<tr>
						<th>상품 정보</th>

						<td>
							<div>
								<label
									class="box pa-10 justify-space-between"
								>
									{{ product_img_name }}
									<v-icon
										class="color-icon"
									>mdi mdi-image</v-icon>

									<input_file
										v-show="false"
										accept="image/*" multiple @change="setFile"
									/>
								</label>
							</div>

							<div class="mt-10" style="max-height: 500px; overflow: auto">
								<draggable
									v-model="files"
									handle=".handle"
								>
									<div
										v-for="(file, index) in files"
										:key="'files_' + index"
										class="flex-row mb-10"
									>
										<div
											v-if="file.type.indexOf('image') > -1"
											class="flex-1" style="position: relative"
										>
											<img
												:src="file.src"
												style="max-width: 180px"
											/>
											<button class="item_close" style="background-color: black">
												<v-icon
													@click="removeFile(index)"
												>mdi-close</v-icon>
											</button>
										</div>
										<div class="flex-3 flex-column justify-center ml-10">
											<p>{{  file.name }}</p>
										</div>
										<div class="handle flex-1 flex-column justify-center text-center mr-20">
											<div class="drag_bar box">
												<v-icon class="mdi-list">mdi-drag-horizontal-variant</v-icon>
											</div>
										</div>
									</div>
								</draggable>
							</div>
						</td>
					</tr>

					<tr
						v-if="false"
					>
						<td
							colspan="2"
						>
							<editor
								v-if="!update_item"
								:options="editorOptions"
								height="300px"
								initialEditType="wysiwyg"
								ref="pdt_info"
								class="text-left mt-10"
							/>
							<editor
								v-else
								:options="editorOptions"
								height="300px"
								:initialValue="item.pdt_info"
								initialEditType="wysiwyg"
								ref="pdt_info"
								class="text-left mt-10"
							/>
						</td>
					</tr>
					<tr>
						<th>배송 / 반품 정보 </th>
						<td>
							<div>
								<label
									class="box pa-10 justify-space-between"
								>
									{{ delivery_img_name }}
									<v-icon
										class="color-icon"
									>mdi mdi-image</v-icon>

									<input_file
										v-show="false"
										accept="image/*" @change="setFile2"
									/>
								</label>
							</div>

							<div
								v-if="item_upload_delivery_img.src"
								class="flex-row mt-10"
							>
								<div
									v-if="item_delivery_img.type.indexOf('image') > -1"
									class="flex-1" style="position: relative"
								>
									<img
										:src="item_upload_delivery_img.src"
										style="max-width: 180px"
									/>
									<button class="item_close" style="background-color: black">
										<v-icon
											@click="item_upload_delivery_img = {}"
										>mdi-close</v-icon>
									</button>
								</div>
								<div class="flex-3 flex-column justify-center ml-10">
									<p>{{  item_upload_delivery_img.name }}</p>
								</div>
							</div>
						</td>
					</tr>
					<tr
						v-if="false"
					>
						<td colspan="2">
							<editor
								v-if="!update_item"
								:options="editorOptions"
								height="300px"
								initialEditType="wysiwyg"
								ref="pdt_notice"
								class="text-left mt-10"
							/>
							<editor
								v-else
								:options="editorOptions"
								height="300px"
								:initialValue="item.pdt_notice"
								initialEditType="wysiwyg"
								ref="pdt_notice"
								class="text-left mt-10"
							/>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div class="mt-30 text-center">
			<button
				class="pa-10 box btn-blue mr-10"
				@click="save"
			>{{ btn_name }}</button>
			<button
				class="pa-10 box btn-gray"
				@click="$storage.push({ name:'ProductList', not_query: true})"
			>목록 </button>
		</div>
	</div>
</template>

<script>

import '@toast-ui/editor/dist/toastui-editor.css';
import draggable from 'vuedraggable'

import { Editor } from '@toast-ui/vue-editor';
import input_file from '@/components/InputFile'

export default {
	name: 'ProductItem'
	,props: ['Axios', 'user', 'rules', 'update_item', 'codes', 'TOKEN']
	,components: {
		editor: Editor
		, draggable
		, input_file
	}
	,data: function(){
		return {
			program: {
				name: this.update_item ? '상품 정보' : '상품 등록'
				,top: true
				,title: true
				,bottom: false
			}
			,item: {
				ATOKEN: this.TOKEN
				,pdt_company: this.user.admin_type_code == 'supply' ? this.user.admin_id : ''
				,pdt_category: ''
			}
			,sub_img: [

			]
			,editorOptions: {
				hideModeSwitch: true
			}
			,item_options: {
				option: []
			}
			,supply_list: []
			,category_list: []
			, files: []
			, upload_files: []
			, file_max: 10
			, item_delivery_img: {}
			, item_upload_delivery_img: {}
		}
	}
	,computed: {
		btn_name: function (){
			if(this.item.uid){
				return '저장'
			}else{
				return '신규 등록'
			}
		}
		,is_supply: function(){
			if(this.user.admin_type == 'suppy'){
				return true
			}else{
				return false
			}
		}
		,main_img_name: function(){
			let name = '대표 이미지'
			if(this.item.pdt_img1){
				name = this.item.pdt_img1.name
			}
			return name
		}
		,sub_img_name: function(){
			let name = '상품 이미지'

			for(const [key, value] of Object.entries(this.sub_img)){

				name = value.name
				if(key > 0){
					name = value.name + ' 외 ' + key + '개'
				}
			}
			return name
		}
		,product_img_name: function(){
			let name = '상품 정보 이미지'

			for(const [key, value] of Object.entries(this.upload_files)){

				name = value.name
				if(key > 0){
					name = value.name + ' 외 ' + key + '개'
				}
			}
			return name
		}
		, delivery_img_name: function(){
			let name = '배송 / 반품 정보 이미지'
			return name
		}
	}
	,methods: {
		setMainImg: function(e){
			let main_img = e.target.files[0]
			this.$set(this.item, 'pdt_img1', main_img)
		}
		,setSubImg: function(e){
			let sub_img = e.target.files

			this.sub_img = sub_img

			for(const [key, val] of Object.entries(sub_img)){
				this.$set(this.item, 'pdt_img' + (Number(key)+2), val)
			}
			this.$set(this.item, 'img_cnt', Object.keys(sub_img).length)
		}
		,save: async function(){

			for(let [key, val] of Object.entries(this.item_options.option)){
				this.$set(this.item, 'pdt_options' + key, val.uid + ';;' + val.opt_name + ';;' + val.opt_cont)
			}

			this.$set(this.item, 'opt_cnt', Object.keys(this.item_options.option).length)

			if(this.upload_files.length > 0){
				for(const [key, value] of Object.entries(this.upload_files)){
					this.$set(this.item, 'upload_files' + key, value)
				}
				this.$set(this.item, 'file_cnt', this.upload_files.length)
			}
			this.$set(this.item, 'item_delivery_img', this.item_delivery_img)

			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'post'
					,url: 'management/postProduct'
					,data: this.item
				})

				if(result.success){
					this.$emit('setNotify', { type: 'success', message: result.message })
					this.$emit('goBack')
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally{
				this.$emit('offLoading')
			}
		}
		,addOption: function(){
			this.item_options.option.push({
				uid: ''
				,opt_name: ''
				,opt_cont: ''
			})
		}
		,removeOption: async  function(option, index){
			//console.log(option)
			if(option.uid){
				if(confirm("옵션을 삭제하시겠습니까?1")){
					this.item_options.option.splice(index, 1)

					try{
						option.ATOKEN = this.TOKEN
						const result = await this.Axios({
							method: 'post'
							,url: 'management/postProductOptionDelete'
							,data: option
						})

						if(result.success){
							this.item_options.option.splice(index, 1)
						}else{
							this.$emit('setNotify', { type: 'error', message: result.message })
						}
					}catch (e) {
						console.log(e)
					}
				}
			}else{
				this.item_options.option.splice(index, 1)
			}
		}

		,getCategoryList: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getCategoryList'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.category_list = result.data.result
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,getSupplyList: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getSupplyList'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.supply_list = result.data.result
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}

		, do: async function(){
			await this.getCategoryList()

			await this.getSupplyList()
		}
		, setFile: function(e){
			console.log('setFile', e)
			console.log(e[0].size / 1024)

			let file_count = this.files.length + e.length
			if(file_count > this.file_max){
				this.$emit('notify', { type: 'error', message: this.$language.common.error_file_limit})
				return false
			}

			console.log('for files')
			let self = this
			for(let file of e){
				console.log(`file` , file)
				this.upload_files.unshift(file)
				const reader = new FileReader()
				let data = {
					name: file.name
					, size: file.size
					, type: file.type
				}

				reader.onload = function(e){
					console.log('reader.onload')
					data.src = e.target.result
					self.files.unshift(data)
				}

				reader.readAsDataURL(file)
			}
		}

		, setFile2: function(e){
			console.log('setFile2', e)

			let self = this
			for(let file of e){
				console.log(`file` , file)
				this.item_delivery_img = file
				const reader = new FileReader()
				let data = {
					name: file.name
					, size: file.size
					, type: file.type
				}

				reader.onload = function(e){
					console.log('reader.onload')
					data.src = e.target.result
					self.item_upload_delivery_img = data
				}

				reader.readAsDataURL(file)
			}
		}
		, removeFile: function(index){
			this.files.splice(index, 1)

			for(const [key] of Object.entries(this.upload_files)) {
				delete this.item['upload_files' + key]
			}
			this.upload_files.splice(index, 1)
		}
	}	,created() {
		this.$emit('onLoad', this.program)
		this.do()
	}
}
</script>

<style>

.v-file-input__text--placeholder {
	color: #bbb !important;
	font-size: 14px;
}

.theme--light.v-icon {
	color: #bbb;
}

.item_close {
	position: absolute; right: 10px; top: 10px
}
</style>