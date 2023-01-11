<template>
	<div
		class="full-height flex-column"
	>
		<div
			class="justify-space-between"
		>
			<div class="flex-1 mr-10 pa-10 bg-white">
				<table class="table td-left">
					<col width="120px" />
					<col width="auto" />
					<tbody>
					<tr>
						<th>대리점</th>
						<td>
							<div class="">
								<select
									v-model="item.pdt_company"
									class="input-box"
									:disabled="is_agency"
								>
									<option
										:value="''"
									>대리점</option>
									<option
										v-for="agency in agency_list"
										:key="agency.account_id"
										:value="agency.account_id"
									>{{ agency.account_name }}</option>
								</select>
								<v-icon
									class="position-absolute color-icon"
									style="right: 10px; top: 10px;"
								>mdi mdi-menu-down</v-icon>
							</div>
						</td>
					</tr>
					<tr>
						<th>카테고리</th>
						<td>
							<div class="mt-10 ">
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
									style="right: 10px; top: 10px;"
								>mdi mdi-menu-down</v-icon>
							</div>
						</td>
					</tr>
					<tr>
						<th>상품 코드</th>
						<td><input class="input-box" v-model="item.pdt_code" readonly /></td>
					</tr>
					<tr>
						<th>상품명</th>
						<td><input class="input-box" v-model="item.pdt_name" /></td>
					</tr>
					<tr>
						<th>공급가</th>
						<td>
							<input
								v-model="item.pdt_purchase"
								type="number"
								class="box pa-10"
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
								class="box pa-10"
								:rules="[rules.max(item, 'pdt_price', 10)]"
							/>
						</td>
					</tr>
					<tr>
						<th>상품 배송비</th>
						<td>
							<input
								v-model="item.pdt_delivery"
								type="number"
								class="box pa-10"
								:rules="[rules.max(item, 'pdt_delivery', 10)]"
							/>
							<div class="color-red mt-10 text-left">
								상품 배송비 책정시 일반 배송비 정책에 포함되지 않으며 추가 배송비로 적용됩니다
							</div>
						</td>
					</tr>
					<tr>
						<th>한줄 설명</th>
						<td><input class="input-box" v-model="item.pdt_summary" /></td>
					</tr>
					<tr>
						<th>썸네일 이미지</th>
						<td
						>
								<span
									class="pdt-img mr-10 flex-column justify-center"
								>
									<img
										v-if="item.pdt_img2"
										:src="item.pdt_img2"
									/>
									<v-icon
										v-else
										class="color-icon"
									>mdi mdi-image</v-icon>
								</span>

							<label>
								<v-icon
									class="color-icon"
								>mdi mdi-image</v-icon>
								<input
									v-show="false"
									type="file"
									@change="setPdtImg"
									accept="image/*"
								/>
								<span>{{ new_main_img }}</span>
							</label>
						</td>
					</tr>
					<tr>
						<th>상품 이미지</th>
						<td>
								<span
									v-for="(sub, index) in sub_images"
									:key="sub.pdt_img"
									class="pdt-img mr-10 position-relative"
								>
										<img
											v-if="sub.pdt_img"
											:src="sub.pdt_img"
										/>
										<v-icon
											v-else
											class="color-icon"
										>mdi mdi-image</v-icon>

										<v-icon
											v-if="sub.pdt_img"
											small
											class="box color-red position-absolute bg-base"
											style="top: 5px; right: 5px;"
											@click="removeImg(sub, index)"
										>mdi mdi-close</v-icon>
								</span>
							<label
							>
								<input
									v-show="false"
									type="file"
									@change="setSubImg"
									multiple
									accept="image/*"
								/>
								<span>{{ new_sub_img }}</span>
							</label>
						</td>
					</tr>
					<tr>
						<th>상품 옵션 <v-icon
							small
							class="box color-green "
							@click="addOption"
						>mdi mdi-plus</v-icon></th>
						<td>
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
							<div class="color-red mt-10 text-left">
								옵션 내용은 콤마(,)로 구분합니다 ex) 사이즈: s,m,l,xl,xxl
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="flex-1 pa-10 bg-white">
				<table class="table td-left">
					<col width="120px" />
					<col width="auto" />
					<tbody>
					<tr>
						<th>상품 설명</th>
						<td><textarea
							v-model="item.pdt_info"
							class="box"
							maxlength="2500"
							style="min-height: 150px"
						></textarea></td>
					</tr>
					<tr>
						<th>상세페이지 이미지</th>
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
											class="flex-1" style="position: relative"
										>
											<img
												:src="file.file_path"
												style="max-width: 180px"
											/>
											<button class="item_close" style="background-color: black">
												<v-icon
													@click="removeFile(file, index)"
												>mdi mdi-close</v-icon>
											</button>
										</div>
										<div class="flex-3 flex-column justify-center ml-10">
											<p>{{  file.file_name }}</p>
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
						<td colspan="2">
							<editor
								v-if="item.pdt_info"
								:initialValue="item.pdt_info"
								:options="editorOptions"
								height="350px"
								initialEditType="wysiwyg"
								ref="pdt_info"
								class="text-left"
							/>
						</td>
					</tr>
					<tr>
						<th>배송 / 반품 정보</th>
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
									class="flex-1" style="position: relative"
								>
									<img
										:src="item_upload_delivery_img.src"
										style="max-width: 180px"
									/>
									<button class="item_close" style="background-color: black">
										<v-icon
											@click="removeDelivery"
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
								v-if="item.pdt_notice"
								:initialValue="item.pdt_notice"
								:options="editorOptions"
								height="250px"
								initialEditType="wysiwyg"
								ref="pdt_notice"
								class="text-left"
							/>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="text-center mt-10">
			<button
				class="pa-10 box bg-identify mr-10"
				@click="save"
			>저장</button>
			<button
				class="pa-10 box"
				@click="$storage.push({ name: 'ProductList', not_query: true})"
			>목록</button>
		</div>
	</div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import draggable from 'vuedraggable'

import { Editor } from '@toast-ui/vue-editor';
import input_file from '@/components/InputFile'


export default {
	name: 'ProductDetail'
	,props: ['Axios', 'user', 'cart_cnt', 'TOKEN', 'rules', 'codes']
	,components: {
		editor: Editor
		, input_file
		, draggable
	}
	,data: function(){
		return {
			program: {
				name: '상품 정보'
				,top: true
				,title: true
				,bottom: false
			}
			,item_ori: null
			,item_options: {

			}
			,item_files: {
				sub: []
			}
			,category: [

			]
			,new_item: {

			}
			,main_img: null
			,sub_img: {

			}
			,editorOptions: {
				hideModeSwitch: false
			}
			,new_main_img: '이미지 선택'
			,new_sub_img: '이미지 선택'
			,pdt_code: this.$route.params.pdt_code
			,category_list: []
			,agency_list: []
			, files: []
			, upload_files: []
			, file_max: 10
			, item_delivery_img: ''
			, item_upload_delivery_img: {}
		}
	}
	,computed: {
		item: function(){

			if(!this.item_ori){
				return false
			}
			let item = this.item_ori

			if(item.pdt_img1){
				item.pdt_img = this.$pdt_img_url + item.pdt_img1
			}

			if(!item.pdt_info || item.pdt_info === undefined){
				item.pdt_info = ' '
			}

			if(!item.pdt_notice || item.pdt_notice === undefined){
				item.pdt_notice = ' '
			}

			return item
		}
		,sub_images: function(){

			return this.item_files.sub.filter((item) => {
				if(item.file_name){
					item.pdt_img = item.file_path
				}
				return item
			})
		}
		,is_agency: function(){
			let t = false
			if(this.user.role == 'agency'){
				t = true
			}
			return t
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
		getData: async function(){
			console.log('getData start !!')
			try{
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getProduct'
					,data: {
						ATOKEN: this.TOKEN
						,pdt_code: this.pdt_code
					}
				})

				if(result.success){
					this.$set(this, 'item_ori', result.data.result)
					this.item_options = result.data.pdt_option
					this.item_files = result.data.pdt_files
					this.files = result.data.pdt_files.file
					this.item_upload_delivery_img_uid = result.data.pdt_files.delivery.uid
					this.item_upload_delivery_img = {
						src: result.data.pdt_files.delivery.file_path
						, name: result.data.pdt_files.delivery.file_name
						, type: 'image'
					}
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				console.log('getData finished !!')
			}
		}
		, save: async function(){
			console.log('save start !!')

			this.new_item.ATOKEN = this.TOKEN
			this.new_item.pdt_uid = this.item.uid
			this.new_item.pdt_name = this.item.pdt_name
			this.new_item.pdt_purchase = this.item.pdt_purchase
			this.new_item.pdt_price = this.item.pdt_price
			this.new_item.pdt_delivery = this.item.pdt_delivery
			this.new_item.pdt_summary = this.item.pdt_summary
			this.new_item.pdt_category = this.item.pdt_category
			this.new_item.pdt_company = this.item.pdt_company
			this.new_item.pdt_info = this.item.pdt_info

			for(let [key, val] of Object.entries(this.item_options.option)){
				this.$set(this.new_item, 'pdt_options' + key, val.uid + ';;' + val.opt_name + ';;' + val.opt_cont)
			}
			if(this.item_delivery_img){
				this.$set(this.new_item, 'item_delivery_img', this.item_delivery_img)
			}

			try{
				this.$bus.$emit('on', true)
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postSupplyProduct'
					,data: this.new_item
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message })
					await this.getData()
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: e })
			}finally {
				console.log('save finished !!')
				this.$bus.$emit('on', false)
			}
		}
		,addOption: function(){
			this.item_options.option.push({
				uid: ''
				,opt_name: ''
				,opt_cont: ''
			})
		}
		,removeOption: async function(option, index){
			//console.log(option)
			if(option.uid){
				if(confirm("옵션을 삭제하시겠습니까?1")){
					this.item_options.option.splice(index, 1)

					try{
						option.ATOKEN = this.TOKEN
						const result = await this.$request.init({
							method: 'post'
							,url: 'management/postProductOptionDelete'
							,data: option
						})

						if(result.success){
							this.item_options.option.splice(index, 1)
						}else{
							this.$bus.$emit('notify', { type: 'error', message: result.message })
						}
					}catch (e) {
						console.log(e)
					}
				}
			}else{
				this.item_options.option.splice(index, 1)
			}
		}
		,setPdtImg: function(e){
			let file = e.target.files[0]
			this.$set(this.new_item, 'main_img', file)
			this.new_main_img = e.target.files[0].name
		}
		,setSubImg: function(e){
			let files = e.target.files

			for(const [key, val] of Object.entries(files)){
				this.$set(this.new_item, 'pdt_img' + (Number(key)+2), val)
			}

			this.new_sub_img = e.target.files[0].name + ' 외 ' + Object.keys(files).length + ' 건'
			this.$set(this.new_item, 'img_cnt', Object.keys(files).length)
		}
		,removeImg: async function(sub, index){
			if(confirm("삭제하시겠습니까?")){
				try{
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postProductImageDelete'
						,data: {
							ATKOEN: this.TOKEN
							, uid: sub.uid
							, pdt_uid: sub.pdt_uid
							, img_type: sub.img_type
						}
					})

					if(result.success){
						this.item_files.sub.splice(index, 1)
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
		}
		,clear: function (){
			console.log('clear start !!')
			this.new_item = {}
			this.item_files = {}
			this.item_ori = null
			console.log('clear finished !!')
		}
		,getCategoryList: async function(){
			try{
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getCategoryList'
					,data: {
						agency_id: this.item.pdt_company
					}
				})

				if(result.success){
					this.category_list = result.data.result
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}

		,getAgencyList: async  function(){
			try{
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getAgencyList'
					,data: {
						agency_type: 'A001003'
					}
				})

				if(result.success){
					this.agency_list = result.data.result
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}

		, do: async function(){

			await this.getData()

			await this.getAgencyList()
			
			await this.getCategoryList()
		}
		, setFile: async function(e){
			console.log('setFile', e)
			console.log(e[0].size / 1024)

			try {
				this.$bus.$emit('on', true)
				let file_count = this.files.length + e.length
				if (file_count > this.file_max) {
					this.$bus.$emit('notify', {type: 'error', message: this.$language.common.error_file_limit})
					return false
				}

				let data = {
					ATOKEN: this.TOKEN
					, pdt_uid: this.item.uid
					, file_cnt: e.length
				}
				for (let i = 0; i < e.length; i++) {
					data['upload_files' + i] = e[i]
				}

				const result = await this.$request.init({
					method: 'post'
					, url: 'management/postProductFileUpdate'
					, data: data
				})

				if (result.success) {
					await this.getData()
				} else {
					throw result.message

				}
			}catch (e){
				console.log(e)
				this.$bus.$emit('notify', {type: 'error', message: e})
			}finally {
				this.$bus.$emit('on', false)
			}
		}

		, setFile2: function(e){
			console.log('setFile2', e)

			let self = this
			for(let file of e){
				console.log(`file` , file)
				this.item_delivery_img = file
				this.item_delivery_img.uid = this.item_upload_delivery_img_uid
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
		, removeDelivery: async function(){
			if(this.item_delivery_img){
				this.item_upload_delivery_img = {}
				this.item_delivery_img = {}
			}else{
				if(confirm("삭제하시겠습니까?")){

					try{
						const result = await this.$request.init({
							method: 'post'
							,url: 'management/postProductImageDelete'
							,data: {
								ATKOEN: this.TOKEN
								, uid: this.item_upload_delivery_img_uid
								, pdt_uid: this.item.uid
								, img_type: 'delivery'
							}
						})

						if(result.success){
							this.item_upload_delivery_img = {}
							this.item_delivery_img = {}
						}else{
							this.$bus.$emit('notify', { type: 'error', message: result.message })
						}
					}catch (e) {
						console.log(e)
					}
				}
			}
		}
		, removeFile: async function(file, index){
			if(confirm("삭제하시겠습니까?")){

				try{
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postProductImageDelete'
						,data: {
							ATKOEN: this.TOKEN
							, uid: file.uid
							, pdt_uid: file.pdt_uid
							, img_type: file.img_type
						}
					})

					if(result.success){
						this.files.splice(index, 1)
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.do()
	}
	,watch:{

	}
}

</script>

<style type="text/css">
.pdt-title {
	padding: 10px 0;
	font-size: 16px;
	color: black;
}

.pdt-price {
	font-size: 16px;
	color: black;
	font-weight: bold;
	font-family: Helvetica,Apple-Gothic,Dotum,"돋움",Gulim,"굴림";
}


.pdt-pdt_options {
	margin-top: 20px;
}

.pdt-option:first-child,
.li-pdt-option:first-child {

}

.pdt-option {
	border: 1px solid #bbb;
	border-radius: 2px;
	margin-top: 10px;
	padding: 10px;
}

.pdt-option .option-name {
	color: black;
	font-weight: bold;
}

.ul-pdt-option {
}

.li-pdt-option {
	border: 1px solid #ddd;
	border-radius: 10px;
	padding: 10px;
	margin-bottom: 10px;
}

.li-pdt-option:active {
	background-color: #eee;
}

.pdt-cnt {
	padding: 10px;
	border: 1px solid #ddd;
}
.box-pdt-cnt {
}

.box-pdt-cnt > button {
	border: 1px solid #ddd;
	width: 100%;
	font-size: 20px;
}
.box-pdt-cnt > input {
	border: none;
	border-top: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
	padding: 0px 5px;
	width: 100%;
	text-align: center;
}

.left,
.right {
	background: none !important;
}

.carousel-control {
	color: black;
}

.shadow-top {
	box-shadow: 0px 2px 5px black;
}

.span-pdt-cnt {
	display: inline !important; line-height: 240%;
}

.select {
	width: 100%;
	padding: 10px;
	color: black;
}


.pdt-info img,
.pdt-notice img {
	max-width: 100%;
}


.toastui-editor-defaultUI-toolbar button {
	margin: 7px 2px;
}

.table-td-left td { text-align: left }

.pdt-img {
	display: inline-block;
	width: 80px;
	height: 80px;
	overflow: hidden;
}

.pdt-img img { width: 100%}


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
