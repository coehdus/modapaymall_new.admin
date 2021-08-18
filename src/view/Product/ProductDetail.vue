<template>
	<div
		class="full-height flex-column"
	>
		<div
			class="bg-title"
		>
			<button
				:title="program.name"
				@click="toBack"
			><v-icon large class="">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-15 vertical-middle">{{ program.name }}</span></button>
		</div>
		<div
			class="pa-10 full-height flex-column overflow-y-auto"
		>
			<div
				class="pdt-img mt-30"
			>
				<div class="middlebanner">
					<div class="">
						<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
							<!-- Indicators -->
							<ol class="carousel-indicators">
								<li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
							</ol>
							<!-- Wrapper for slides -->
							<div class="carousel-inner" role="listbox" style="text-align: center;">
								<div class="item active">
									<img src="<?=IMG_DIR?>visual_img01.jpg" alt="main1">
								</div>
							</div>

							<!-- Controls -->
							<a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
								<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
								<span class="sr-only">Previous</span>
							</a>
							<a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
								<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
								<span class="sr-only">Next</span>
							</a>
						</div>
					</div>
				</div>
			</div>

			<div
				class="flex-row justify-space-between"
			>
				<div
					class="pdt-price"
				>{{  item.pdt_price | makeComma }}</div>
				<div
					class="pdt-rate"
				>평점</div>
			</div>

			<div
				class="pdt-pdt_options"
			>
				<div
					v-for="(option, index) in pdt_options"
					:key="'option_' + index"
					class="pdt-option"
				>
					<div
						class=" flex-row justify-space-between"
						@click="toggleOption(option)"
					>
						<span>
							<span
								class="option-name mr-10"
							>{{ option.opt_name }}</span>
							<span
								v-if="option.opt"
								class="option-select"
							>{{ option.opt }}</span>
						</span>
						<button
							class="btn-info btn-xs mdi mdi-chevron-down"
						>
						</button>
					</div>
					<ul
						v-if="option.is_view"
						class="ul-pdt-option mt-10"
					>
						<li
							v-for="opt in option.opt_cont.split(',')"
							:key="'option_' + index + '_' + opt"
							class="li-pdt-option"
							@click="setOption(option, opt)"
						>{{ opt }}</li>
					</ul>
				</div>
			</div>

			<div
				class="pdt-cnt mt-10 flex-row justify-space-between"
			>
				<span
					class="flex-2 font-weight-bold color-black"
					style="display: inline !important; line-height: 240%;"
				>수량</span>
				<span
					class="flex-1 flex-row justify-space-between box-pdt-cnt"
				>
					<button
						@click="setCnt('down')"
						class="flex-1 mdi mdi-minus"

					></button>
					<input
						v-model="pdt_cnt"
						type="number"
						name="pdt_cnt"
						value="1"
						class="flex-1"

					/>
					<button
						@click="setCnt('up')"
						class="flex-1 mdi mdi-plus"
					></button>
				</span>
			</div>
		</div>

		<div
			class="mt-auto pa-10 shadow-top"
		>
			<div
				class="pdt-cnt flex-row justify-space-between"
			>
			<span
				class="font-weight-bold color-black"
			>총 상품가</span>
				<span
					class="order-price font-weight-bold color-black"
				>{{ total_price | makeComma }}</span>
			</div>
			<div
				class="mt-10 flex-row justify-space-between"
			>
				<button
					class="flex-1 btn btn-default mr-10"
				>바로구매</button>
				<button
					class="flex-1 btn btn-primary"
					@click="setCart"
				>장바구니</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ProductDetail'
		,props: ['Axios', 'item']
		,data: function(){
			return {
				program: {
					name: this.item.pdt_name
					,top: false
					,title: false
					,bottom: false
				}
				// 상품옵션
				,pdt_options: [

				]
				// 판매자 정보
				,seller_info: {
					
				}
				//장바구니
				,cart_items: [
					
				]
				,pdt_cnt: 1
				,files: [

				]
				// 선택한 옵션
				,options: [

				]
			}
		}
		,computed: {
			total_price: function(){
				return this.item.pdt_price * this.pdt_cnt
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						, url: 'product/product_info'
						, data: {
							pdt_uid: this.item.uid
						}
					})

					if (result.success) {
						this.pdt_options = result.data.pdt_options
						this.files = result.data.pdt_files
						this.seller_info = result.data.seller_info
					} else {
						this.$emit('setNotify', {type: 'error', message: result.message})
					}
				}catch(E){
					console.log(E)
				}
			}
			,setCart: function(){

				let cart_items = localStorage.getItem("cart_items")
				if(!cart_items || cart_items === "false"){
					cart_items = []
				}else{
					cart_items = JSON.parse(cart_items)
				}
				
				let pdt_cnt = this.pdt_cnt
				let pdt_pdt_options = this.pdt_options
				let pdt_uid = this.item.uid

				let append_type = 'append'
				let msg = "장바구니에 등록되었습니다."

				console.log(pdt_pdt_options.length + " : " + this.pdt_options.length)
				if(pdt_pdt_options && pdt_pdt_options.length != this.pdt_options.length){
					alert('옵션을 선택하세요');
				}else if(!pdt_cnt || pdt_cnt < 1){
					alert('수량을 선택하세요');
				}else{

					let company_items = {
						pdt_company: this.item.pdt_company
						,company: {
							company_name: this.seller_info.shop_name
							,delivery_price: this.seller_info.delivery_price
							,delivery_type: this.seller_info.delivery_type
							,free_price: this.seller_info.free_price
							,island_price: this.seller_info.island_price
							,total_price: 0
						}
						,items: []
					}

					let index = null

					for(let i = 0; i < cart_items.length; i ++){
						let company = cart_items[i]
						if(company.pdt_company == this.item.pdt_company){
							company_items.items = cart_items[i].items
							company_items.company.total_price = cart_items[i].company.total_price

							index = i + ''
							break;
						}
					}
					alert(company_items.company.total_price)
					for(let i = 0; i < company_items.items.length; i ++){
						let item = company_items.items[i]

						if(item.pdt_uid == pdt_uid && item.pdt_option == pdt_pdt_options){

							pdt_cnt = Number(pdt_cnt) + Number(pdt_cnt)
							company_items.company.total_price += (Number(pdt_cnt) * Number(this.item.pdt_price))
							append_type = 'add'
							break
						}
					}
					alert(company_items.company.total_price)

					if(append_type == 'add'){
						msg = "장바구니에 추가되었습니다."
					}else{
						let cart_data = {
							pdt_uid: pdt_uid
							,pdt_name: this.item.pdt_name
							,pdt_img: this.item.pdt_img1
							,pdt_price: this.item.pdt_price
							,pdt_option: pdt_pdt_options
							,pdt_cnt: pdt_cnt
						}
						company_items.company.total_price += (Number(pdt_cnt) * Number(this.item.pdt_price))
						company_items.items.push(cart_data)
					}
					alert(company_items.company.total_price)
					console.log('index: ' + index)
					if(index){
						cart_items[index] = company_items
					}else{
						cart_items.push(company_items)
					}
					console.log(cart_items)

					localStorage.setItem("cart_items", JSON.stringify(cart_items))

					alert(msg);
				}
			}
			,setCnt: function(type){
				let cnt = this.pdt_cnt
				if(cnt == ''){
					cnt = 1
				}
				if(type == 'up'){
					if(cnt >= 99){
						cnt = 99
					}else{
						cnt = Number(cnt) + 1
					}
				}else{
					if(cnt <= 1){
						cnt = 1
					}else{
						cnt = Number(cnt) - 1
					}
				}
				this.pdt_cnt = cnt
			}
			,toBack: function(){
				this.$emit('click')
			}
			,toggleOption: function(option){
				this.$set(option, 'is_view', !option.is_view)
			}
			,setOption: function(option, opt){
				this.$set(option, 'opt', opt)
				this.toggleOption(option)
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>

<style rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" />
<style rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css" />

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

.pdt-img img {
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
	padding: 5px;
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
</style>
