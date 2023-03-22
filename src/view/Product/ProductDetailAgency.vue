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
						<th>공급사</th>
						<td>{{ item.pdt_company }}</td>
					</tr>
					<tr>
						<th>카테고리</th>
						<td>{{ item.pdt_category }}</td>
					</tr>
					<tr>
						<th>상품 코드</th>
						<td>{{ item.pdt_code }}</td>
					</tr>
					<tr>
						<th>상품명</th>
						<td>{{ item.pdt_name }} </td>
					</tr>
					<tr
						v-if="false"
					>
						<th>공급가</th>
						<td>{{ item.pdt_purchase | makeComma }} 원</td>
					</tr>
					<tr
						v-if="false"
					>
						<th>마진가</th>
						<td>
							<input
								v-model="item.agency_price"
								type="number"
								class="box flex-1 pa-5"
								:rules="[rules.max(item, 'agency_price', 10)]"
							/> 원
						</td>
					</tr>
					<tr>
						<th>판매가</th>
						<td>{{ item.pdt_price | makeComma }} 원</td>
					</tr>
					<tr>
						<th>정기결제 상품</th>
						<td>{{ item.is_regular == '1' ? '사용' : '미사용'}} </td>
					</tr>
					<tr>
						<th>상품 배송비</th>
						<td>
							{{ item.pdt_delivery | makeComma }} 원
							<div
								v-if="false"
								class="color-red mt-10 text-left"
							>
								상품 배송비 책정시 일반 배송비 정책에 포함되지 않으며 추가 배송비로 적용됩니다
							</div>
						</td>
					</tr>
					<tr>
						<th>한줄 설명</th>
						<td>{{ item.pdt_summary }}</td>
					</tr>
					<tr>
						<th>대표 이미지</th>
						<td>
							<span class="pdt-img">

								<img
									v-if="item.pdt_img2"
									:src="item.pdt_img2"
								/>
								<v-icon
									v-else
									class="color-icon"
								>mdi mdi-image</v-icon>
							</span>
						</td>
					</tr>
					<tr>
						<th>상품 이미지</th>
						<td>
							<span
								v-for="sub in sub_images"
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
							</span>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="flex-1">
				<table class="table td-left">
					<col width="120px" />
					<col width="auto" />
					<tbody>
					<tr>
						<th>상품 설명</th>
						<td>{{ item.pdt_info }}</td>
					</tr>
					<tr>
						<th>상세페이지 이미지</th>
						<td>
							<div class="mt-10" style="max-height: 500px; overflow: auto">
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
											style="max-width: 100%"
										/>
									</div>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<th>배송 / 반품 정보</th>
						<td>
							<div>
								<v-icon
									class="color-icon"
								>mdi mdi-image</v-icon>
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
										style="max-width: 100%"
									/>
								</div>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="text-center mt-10">
			<button
				class="pa-10 box"
				@click="$storage.push({ name: 'ProductList', not_query: true})"
			>목록</button>
		</div>
	</div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import "@toast-ui/editor/dist/toastui-editor.css";


export default {
	name: 'ProductDetail'
	,props: ['Axios', 'cart_cnt', 'TOKEN', 'rules', 'codes', 'supply_list', 'category_list']
	,components: {}
	,data: function(){
		return {
			program: {
				name: '상품 정보'
				,top: true
				,title: true
				,bottom: false
			}
			,item_ori: {

			}
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
			, item_upload_delivery_img: ''
		}
	}
	,computed: {
		item: function(){
			console.log('item_ori : ' + typeof this.item_ori)
			if(!this.item_ori){
				return false
			}
			let item = this.item_ori

			if(item.pdt_img1){
				item.pdt_img = this.codes.img_url + item.pdt_img1
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

			return this.item_files.sub.filter(function(item){
				if(item.file_name){
					item.pdt_img = item.file_path
				}
				return item
			})
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
						,pdt_code: this.$route.params.pdt_code
					}
				})

				if(result.success){
					this.item_ori = result.data.result
					this.item_options = result.data.pdt_option
					this.item_files = result.data.pdt_files

					this.files = result.data.pdt_files.file

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
			let pdt_info = this.$refs.pdt_info.invoke("getMarkdown")
			let pdt_notice = this.$refs.pdt_notice.invoke("getMarkdown")

			if(!pdt_info){
				this.$refs.pdt_info.invoke("setMarkdown", this.item.pdt_info)
			}
			if(!pdt_notice){
				this.$refs.pdt_notice.invoke("setMarkdown", this.item.pdt_notice)
			}


			this.new_item.ATOKEN = this.TOKEN
			this.new_item.pdt_uid = this.item.uid
			this.new_item.pdt_info =  pdt_info
			this.new_item.pdt_notice = pdt_notice
			this.new_item.pdt_purchase = this.item.pdt_purchase
			this.new_item.pdt_delivery = this.item.pdt_delivery
			this.new_item.pdt_summary = this.item.pdt_summary
			this.new_item.pdt_category = this.item.pdt_category
			this.new_item.pdt_company = this.item.pdt_company

			for(let [key, val] of Object.entries(this.item_options.option)){
				this.$set(this.new_item, 'pdt_options' + key, val.uid + ';;' + val.opt_name + ';;' + val.opt_cont)
			}

			this.$set(this.new_item, 'opt_cnt', Object.keys(this.item_options.option).length)

			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'management/postSupplyProduct'
					,data: this.new_item
				})

				if(result.success){
					this.$emit('goSuccess')
					this.$bus.$emit('notify', { type: 'success', message: result.message })
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				console.log('save finished !!')
			}
		}
		,getCategory: async function(){

		}

		,getSupplyList: async  function(){
			try{
				const result = await this.$request.init({
					method: 'get'
					,url: 'management/getSupplyList'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.supply_list = result.data.result
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
		,addOption: function(){
			this.item_options.option.push({
				uid: ''
				,opt_name: ''
				,opt_cont: ''
			})
		}
		,removeOption: function(option, index){
			//console.log(option)
			if(option.uid){
				if(confirm("옵션을 삭제하시겠습니까?")){
					this.item_options.option.splice(index, 1)
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
					sub.ATOKEN = this.TOKEN
					const result = await this.$request.init({
						method: 'post'
						,url: 'management/postProductImageDelete'
						,data: sub
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
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
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
</style>
