<template>
	<div
		class="full-height flex-column"
	>
		<div
			class="pa-10 full-height pb-30 overflow-y-auto  bg-gray-light">
			<div class="mt-10">
				<h6>주문자 정보</h6>
				<div
					class="mt-10 pa-10 bg-white box-shadow"
				>
					<div class="input-box">{{ user.member_name }}</div>
					<input
						type="number"
						v-model="item.member_tell"
						class="mt-10 input-box"
						placeholder="연락처"
					/>
					<input
						type="email"
						v-model="item.member_email"
						class="mt-10 input-box"
						placeholder="이메일"
					/>
					<div class="mt-5 input-box">{{ user.member_post }} {{ user.member_addr1 }}</div>
					<div class="mt-5 input-box">{{ user.member_addr2 }}</div>
				</div>
			</div>
			<div class="mt-30">
				<div
					class="justify-space-between"
				>
					<h6 class="flex-4">배송지 정보</h6>
					<button class="flex-1 btn btn-blue" style="padding: 0px 5px; font-size: 11px; font-weight: normal">배송지 목록</button>
				</div>
				<div
					class="mt-10 bg-white pa-10 box-shadow"
				>
					<input
						v-model="item.d_name"
						class="input-box"
						placeholder="이름"
					/>
					<input
						v-model="item.d_tell"
						class="mt-10 input-box"
						placeholder="연락처"
					/>
					<div
						class="mt-10 flex-row"
						@click="daumPost('default')"
					>
						<input
							v-model="item.d_post"
							class="input-box flex-3 mr-10"
							placeholder="우편번호"
							readonly
						/>
						<button
							class="btn btn-blue flex-1"
						>주소 검색</button>
					</div>
					<input
						v-model="item.d_addr"
						type="text" placeholder="기본 주소"
						class="mt-10 input-box"
						readonly
						maxlength="80"
						@click="daumPost('default')"
					/>
					<input
						v-model="item.d_addr2"
						type="text" placeholder="상세 주소를 입력하세요"
						class="mt-10 input-box"
						maxlength="50"
					/>
				</div>
			</div>

			<div class="mt-30">
				<h6>상품 정보</h6>
				<div></div>
			</div>

			<template
				v-if="cart_items.length > 0"
			>
				<ul class="mt-10">
					<li
						v-for="(item, item_index) in item_list"
						:key="item_index"
						class="under-line mb-10  bg-white box-shadow"
					>
						<div
							class="pa-10 under-line "
						><v-icon>mdi mdi-home-modern</v-icon>{{ item.company.seller_name }}</div>
						<ul>
							<li
								v-for="(product, product_index) in item.items"
								:key="'product_' + product_index"
								class=" under-line justify-space-between"
							>
								<div class="pa-10 flex-1 odt-img justify-center flex-column">
									<img
										v-if="product.pdt_img"
										:src="'http://delimall.co.kr/API/data/product/' + product.pdt_img" alt="main1"
									/>
									<span
										v-else
									>No Image</span>
								</div>
								<div class="flex-3">
									<div class=" ptb-10 under-line">{{ product.pdt_name }}</div>
									<div
										v-for="(option, index) in product.options"
										:key="'odt_' + index"
										class=" pa-10 under-line-dashed"
									>
										<div class="justify-space-between">
											<span>옵션</span>
											<span>{{ option.odt }}</span>
										</div>
										<div
											class="mt-10 justify-space-between"
										>
											<span
												class="flex-2 color-blue"
											>{{ option.odt_price | makeComma }}</span>

											<span>{{ option.odt_cnt }} 개</span>
										</div>
									</div>

								</div>
							</li>
						</ul>
						<div
							class="pa-10 justify-space-between under-line-dashed"
						>
							<span>배송비 <span class="size-px-11">{{ item.company.delivery }}</span></span>
							<span>{{ item.company.delivery_price | makeComma }}</span>
						</div>
						<div
							class="pa-10 justify-space-between"
						>
							<span>합계</span>
							<span class="color-blue">{{ item.company.total_price | makeComma }}</span>
						</div>
					</li>
				</ul>
			</template>
			<div
				v-else
				class="full-height flex-column justify-center"
			>
				<div class="text-center">No Data</div>
			</div>
			<div class="mt-30">
				<h6>결제 정보</h6>
				<div
					class="mt-10 pa-10 bg-white box-shadow"
				>
					<div class="pa-10 justify-space-around under-line-dashed">
						<span
							@click="item.pay_div = 'bank'"
						>
							<v-icon
								v-if="item.pay_div == 'bank'"
								class="color-green"
							>mdi mdi-radiobox-marked</v-icon>
							<v-icon
								v-else
							>mdi mdi-radiobox-blank</v-icon>
							<span> 무통장 입금</span>
						</span>
						<span
							@click="item.pay_div = 'card'"
						>
							<v-icon
								v-if="item.pay_div == 'card'"
								class="color-green"
							>mdi mdi-radiobox-marked</v-icon>
							<v-icon
								v-else
							>mdi mdi-radiobox-blank</v-icon>
							<span> 카드 결제</span>
						</span>
					</div>
					<div
						class="mt-10"
						v-if="item.pay_div == 'bank'"
					>
						<div>
							무통장 입금 안내
							<div class="mt-10">{{ item.site_bank }}</div>
							<input
								v-model="item.bank_info"
								placeholder="입금자 명"
								class="mt-10 input-box"
							/>
						</div>
					</div>
					<div
						class="mt-10"
						v-if="item.pay_div == 'card'"
					>
						카드결제는 이용할 수 없습니다.
					</div>
				</div>
				<div
					class="pa-30"
				>

				</div>
			</div>
		</div>

		<div
			class="mt-auto flex-column box-shadow position-relative"
		>
			<div>
				<div
					class="pa-10 justify-space-between under-line-dashed"
				>
					<span>배송비 </span>
					<span>{{ total_delivery_price | makeComma }} 원</span>
				</div>
				<div
					class="pa-10 flex-row justify-space-between under-line"
				>
					<span
						class="font-weight-bold color-black"
					>총 상품가</span>
					<span
						class="order-price font-weight-bold color-blue"
					>{{ total_price | makeComma }} 원</span>
				</div>
			</div>
			<div
			>
				<button
					class="btn btn-identify"
					@click="save"
				>
					<span class="color-white size-em-12">{{ order_price | makeComma }} 원 </span>
					<span class="color-white size-em-12"> 결제하기</span>
				</button>
			</div>
		</div>

		<DaumPost
			:overlay="daumPostUp"
			@callBack="addPost"
		></DaumPost>

	</div>
</template>

<script>
import DaumPost from '@/components/Daum/DaumPost'
export default{
	name: 'Cart'
	,props: ['Axios', 'cart_items', 'user']
	,components: { DaumPost }
	,data: function(){
		return {
			program: {
				name: '주문하기'
				,top: false
				,title: true
				,bottom: false
			}
			,daumPostUp: false
			,order_number: ''
			,item: {
				TOKEN: sessionStorage.getItem('delimallAT')
				,pay_div: 'bank'
				,member_tell: '1234'
				,member_email: 'aaa@bbb.com'
				,d_name: '받는분'
				,d_tell: '12345'
				,d_post: '123456'
				,d_addr: '주소'
				,d_addr2: '상세주소'
				,site_bank: '은행 123-45-6789'
				,bank_info: ''
				,c_uid: []
			}
			,shop_info: {

			}
		}
	}
	,computed: {
		order_price: function(){
			let price = 0
			price = this.total_price + this.total_delivery_price
			return price
		}
		,total_price: function(){
			let price = 0;

			for(let i = 0; i < this.cart_items.length; i ++){
				if(!this.cart_items[i].is_not_select) {
					price += (Number(this.cart_items[i].pdt_price) + Number(this.cart_items[i].op_price)) * this.cart_items[i].op_cnt
				}
			}

			return price
		}
		,order_point: function(){
			let point = 0
			return point
		}
		,total_delivery_price: function(){
			let price = 0

			if(Object.keys(this.item_list).length > 0){
				for(const [key, val] of Object.entries(this.item_list)){
					console.log(key)
					price += Number(val.company.delivery_price)
				}
			}

			return price
		}
		,order_item: function(){
			let item = this.item
			item.pay_div = this.item.pay_div
			item.total_price = this.total_price
			item.order_price = this.order_price
			item.order_point = this.order_point
			item.delivery_price = this.total_delivery_price

			if(Object.keys(this.item_list).length > 0) {
				for(const [key, val] of Object.entries(this.cart_items)) {
					console.log(key)
					if(val.is_not_select){
						continue
					}
					item.c_uid.push(val.uid)
				}
			}

			item.c_uid = JSON.stringify(item.c_uid)

			return item
		}
		,item_list: function(){
			let items = {}

			for(const [key ,val] of Object.entries(this.cart_items)){
				console.log('key: ' + key)

				if(val.is_not_select){
					continue
				}
				let company = items[val.seller_id]

				if(!company){
					company = {
						company: {
							total_price: 0
						}
						,items: {}
					}
				}

				items[val.seller_id] = company

				items[val.seller_id]['company']['seller_id'] = val.seller_id
				items[val.seller_id]['company']['seller_name'] = val.shop_name
				items[val.seller_id]['company']['total_price'] += ((Number(val.pdt_price) + Number(val.op_price)) * val.op_cnt)
				items[val.seller_id]['company']['delivery_type'] = val.delivery_type
				items[val.seller_id]['company']['delivery_price'] = val.delivery_price

				if(val.delivery_type == '무료'){
					items[val.seller_id]['company']['delivery_price'] = 0
					items[val.seller_id]['company']['delivery'] = ''
				}else{
					if(val.free_price > 0){
						items[val.seller_id]['company']['delivery'] = val.free_price + ' 이상 구매시 무료'
						if(val.free_price < items[val.seller_id]['company']['total_price']){
							items[val.seller_id]['company']['delivery_price'] = 0
						}
					}
				}

				let product = items[val.seller_id]['items'][val.pdt_uid]

				if(!product || product === undefined){
					product = {
						pdt_uid: val.pdt_uid
						,pdt_img: val.pdt_img1
						,pdt_name: val.pdt_name
						,pdt_price: val.pdt_price
						,options: {}
					}
				}

				items[val.seller_id]['items'][val.pdt_uid] = product

				let option = items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid]
				if(!option || option === undefined){
					option = {
						odt_uid: val.uid
						,odt: val.op_name
						,odt_cnt: val.op_cnt
						,odt_price: Number(val.pdt_price) + Number(val.op_price)
						,cart_index: key
						,is_not_select: val.is_not_select
					}
				}

				if(val.is_sold == 1 || (val.is_sold == 2 && val.pdt_stock < 1)){
					option.is_sold = true
					option.is_not_select = true
				}

				items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid] = option
			}
			console.log(items)
			return items
		}
	}
	,methods: {

		save: async function(){
			try{
				const result = await this.$request.init({
					method: 'post'
					,url: 'order/postCartOrder'
					,data: this.order_item
				})

				if(result.success){
					this.order_number = result.data.order_number
					this.$bus.$emit('notify', { type: 'success', message: result.message})
					this.toResult()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}
		}
		,daumPost: function (type) {
			this.$emit('setOverlay')
			this.daumPostUp = true
			this.daumPostType = type
		}
		, addPost: function (call) {

			this.$set(this.item, 'd_post', call.zonecode)
			this.$set(this.item, 'd_addr', call.address)

			this.daumPostUp = false
			this.$emit('setOverlay')
		}
		,toResult: function(){
			this.$router.push({ name: 'OrderResult', params: { order_number: this.order_number }})
		}
	}
	,created: function(){
		this.$emit('onLoad', this.program)
	}
}
</script>

<style>

.pdt-cnt {
	padding: 10px;
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

.odt-img {
	margin-right: 10px
}
.odt-img img {width: 100% !important;}
</style>