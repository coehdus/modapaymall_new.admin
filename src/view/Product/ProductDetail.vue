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
					v-for="(pdt_option, index) in pdt_options"
					:key="'option_' + index"
					class="mt-10"
				>
					<select
						v-model="option[index]"
						class="select"
					>
						<option value="">{{ pdt_option.opt_name }}</option>
						<option
							v-for="opt in pdt_option.opt_cont.split(',')"
							:key="'option_' + index + '_' + opt"
							:value="opt"
						>{{ opt }}</option>
					</select>
				</div>

			</div>


		</div>

		<div
			class="mt-auto pa-10 shadow-top"
		>
			<ul>
				<li
					v-for="(odt, index) in odts"
					:key="'odt_' + index"
					class="pdt-cnt"
				>
					<div
						class=" flex-row justify-space-between"
					>
						<span
							class="flex-1 font-weight-bold color-black span-pdt-cnt"
						>{{ odt.odt }}</span>
						<span
							class="flex-1 flex-row justify-space-between box-pdt-cnt"
						>
							<button
								@click="setCnt(odt, 'down')"
								class="flex-1 mdi mdi-minus"
							></button>
							<input
								v-model="odt.odt_cnt"
								type="number"
								name="pdt_cnt"
								class="flex-1 bg-gray-light"
								readonly
							/>
							<button
								@click="setCnt(odt, 'up')"
								class="flex-1 mdi mdi-plus mr-10"
							></button>
							<button
								@click="removeItem(index)"
								class="flex-1 color-red mdi mdi-delete-outline"
							></button>
						</span>
					</div>
				</li>
			</ul>
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
				// 현재 옵션
				,option: []
				// 선택한 옵션
				,options: [

				]
			}
		}
		,computed: {
			total_price: function(){
				let price = 0
				let pdt_price = this.item.pdt_price
				this.options.forEach(function(item){
					price += Number(item.odt_cnt) * (Number(pdt_price) + Number(item.odt_price))
				})
				return price
			}
			,odts: function(){
				return this.options.filter(function(item){

					return item.odt.replaceAll(',', '/')
				})
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

				let append_type = 'append'
				let msg = "장바구니에 등록되었습니다."

				if(!this.options.length){
					alert('옵션을 선택하세요');
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

					// 장바구니 조회
					for(let i = 0; i < cart_items.length; i++){
						let company = cart_items[i]
						// 동일 판매자가 있다면 상품 조회
						if(company.pdt_company == this.item.pdt_company) {
							console.log('동일 판매자가 있다면 상품 조회 ')
							let items = company.items
							// 동일 판매자의 상품 조회
							for(let j = 0; j < items.length; j++){
								// 동일 상품이 있다면 옵션 조회
								if(items[j].pdt_uid == this.item.uid){
									console.log('동일 상품이 있다면 옵션 조회 ')
									let options = items[j].pdt_option

									if(!options.length){
										console.log('옵션이 없다면 추가 ')
										options = this.options
										break
									}
									// 동일 상품의 옵션 조회
									for(let k = 0; k < this.options.length; k++){

										// 동일 옵션 조회
										for(let l = 0; l < options.length; l++){
											let option = options[l]
											// 동일 옵션이 있을 경우 수량 증가
											console.log(this.options[k].odt + ' : ' + option.odt)
											if(this.options[k].odt == option.odt){
												console.log('동일 옵션이 있을 경우 수량 증가')
												option.odt_cnt += this.options[k].odt_cnt
												console.log(option.odt_cnt)
												this.options[k].is_cart = true
												break
											}
										}
										// 장바구니에 있으면
										if(this.options[k].is_cart){
											append_type = 'add'
											console.log('장바구니에 있으면 다음 옵션')
											continue
										// 장바구니에 없으면
										}else{
											console.log('장바구니에 없으면 추가')
											options.push(this.options[k])
										}
									}
								// 동일 상품이 없다면
								}else{
									console.log('동일 상품이 없다면 상품 추가')
									// 상품 추가 - 옵션 포함
									items.push({
										pdt_uid: this.item.uid
										,pdt_name: this.item.pdt_name
										,pdt_img: this.item.pdt_img1
										,pdt_price: this.item.pdt_price
										,pdt_option: this.options
									})

									break
								}
							}
						// 동일 판매자가 없다면
						}else{
							console.log('동일 판매자가 없다면 상품 추가 ')
							// 상품 추가 - 옵션 포함
							company_items.items.push({
								pdt_uid: this.item.uid
								,pdt_name: this.item.pdt_name
								,pdt_img: this.item.pdt_img1
								,pdt_price: this.item.pdt_price
								,pdt_option: this.options
							})

							// 판매자 추가
							cart_items.push(company_items)

							break;
						}
					}
					if(!cart_items.length){
						console.log('빈 장바구니 추가 ')
						company_items.items.push({
							pdt_uid: this.item.uid
							,pdt_name: this.item.pdt_name
							,pdt_img: this.item.pdt_img1
							,pdt_price: this.item.pdt_price
							,pdt_option: this.options
						})
						cart_items.push(company_items)
					}

					localStorage.setItem("cart_items", JSON.stringify(cart_items))
					if(append_type == 'add'){
						msg = '장바구니에 추가 되었습니다'
					}
					alert(msg);
				}
			}
			,setCnt: function(odt, type){
				let cnt = odt.odt_cnt
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
				odt.odt_cnt = cnt
			}
			,toBack: function(){
				this.$emit('click')
			}
			,toggleOption: function(option){
				this.$set(option, 'is_view', !option.is_view)
			}
			,setOption: function(option, opt){
				console.log(option)
				this.$set(option, 'opt', opt)
				this.toggleOption(option)
			}
			,resetOption: function(call){
				for(let i = 0; i < call.length; i++){
					this.$set(this.option, i, '')
				}
			}
			,removeItem: function(index){
				if(confirm('해당 옵션을 삭제하시겠습니까?')){
					this.$delete(this.options, index)
				}
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
		,watch:{
			pdt_options: {
				immediate: true
				,handler: function (call){
					this.resetOption(call)
				}
			}
			,option: {
				deep: true
				,handler: function (call){
					let full = true
					call.forEach(function(item){
						if(!item){
							full = false
							return false
						}
					})

					if(full){
						let val = {
							odt: call.toString()
							,odt_price: 0
							,odt_cnt: 1
						}

						let result = this.options.filter(function(item){
							if(item.odt == val.odt){
								return item.odt_cnt++
							}

						})

						if(result.length){
							result.odt_cnt++
						}else{
							this.options.push(val)
						}

						this.resetOption(this.option)
					}
				}
			}
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
</style>
