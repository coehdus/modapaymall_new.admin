<template>
	<div
		class="full-height flex-column"
	>
		<div
			class="justify-space-between under-line"
		>
			<span>카테고리</span>
			<div></div>
		</div>

		<div
			class="justify-space-between under-line"
		>
			<span>상품코드</span>
			<div>
				<input
					v-model="item.pdt_code"
					placeholder="상품코드"
					class="input-box"
					readonly
				/>
			</div>
		</div>

		<div
			class="justify-space-between under-line"
		>
			<span>상품명</span>
			<div>
				<input
					v-model="item.pdt_name"
					placeholder="상품명을 입력하세요"
					class="input-box"
				/>
			</div>
		</div>

		<div
			class="justify-space-between under-line"
		>
			<span>공급사</span>
			<div>

				<select
					class="pa-10 mr-10"
					v-model="item.pdt_company"
				>
					<option
						:value="''"
					>공급사를 선택하세요</option>
					<option
						v-for="supply in supply_list"
						:key="supply.admin_id"
						:value="supply.admin_id"
					>{{ supply.shop_name }}</option>
				</select>
			</div>
		</div>

		<div
			class="justify-space-between under-line"
		>
			<span>공급가</span>
			<div>
				<input
					v-model="item.pdt_purchage"
					placeholder="공급가를 입력하세요"
					class="input-box"
				/>
			</div>
		</div>
		<div>
			<span>대표 이미지</span>
			<div>
				<input
					type="file"
				/>
			</div>
		</div>
		<div>
			<span>상품 이미지</span>
			<div>
				<input
					type="file"
					multiple
				/>
			</div>
		</div>
		<div>
			<span>상품내용</span>
			<textarea
				v-model="item.pdt_content"
			></textarea>
		</div>
	</div>
</template>

<script>

	export default {
		name: 'ProductDetail'
		,props: ['Axios', 'cart_cnt']
		,components: { }
		,data: function(){
			return {
				program: {
					name: '상품 등록'
					,top: true
					,title: true
					,bottom: false
				}
				,item: {
					pdt_company: ''
				}
				,category: [

				]
				,supply_list: [

				]
				,main_img: null
			}
		}
		,computed: {

		}
		,methods: {
			getData: async function(){

			}
			,getCategory: async function(){

			}

			,getSupplyList: async  function(){
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
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
			this.getSupplyList()
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

.pdt-img1 img {
	width: 50%;
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
</style>
