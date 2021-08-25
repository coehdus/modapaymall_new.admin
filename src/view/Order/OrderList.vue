<template>
	<div
		class="full-height "
	>
		<div
			class="pa-10 full-height pb-30 bg-gray-light"
		>
			<ul
				class="full-height overflow-y-auto"
			>
				<li
					v-for="(item, index) in item_list"
					:key="item.uid"
					class=" bg-white mb-20 box-shadow position-relative"
				>
					<div
						class="pa-10 bg-gray-light under-line justify-space-between"
						@click="toResult(item.order_num_new)"
					>
						<span>{{ item.order_num_new}}</span>
						<v-icon >mdi mdi-arrow-right-bold-box-outline</v-icon>
					</div>
					<div
						class="pa-10"
					>
						<div class="justify-space-between under-line-dashed pb-10">
							<span class="color-blue">{{ item.order_price | makeComma }}</span>
							<span>
								<span
									class="mr-10"
									:class="item.o_status_color"
								>{{ item.o_status_name }}</span>

								<button
									v-if="item.is_cancel"
									class="btn-danger size-px-12 prl-10"
									@click="viewCancel(item, index)"
								>주문 취소</button>
							</span>
						</div>
						<ul
							@click="toResult(item.order_num_new)"
						>
							<li
								v-for="odt in item.odt_list"
								:key="'odt_' + odt.uid"
								class="under-line-dashed ptb-10"
							>
								<div class="justify-space-between">
									<span class="flex-1 pdt-img mr-10 flex-column justify-center">
										<img
											v-if="odt.pdt_img"
											:src="'http://delimall.co.kr/API/data/product/' + odt.pdt_img"
										/>
										<v-icon
											v-else
										>mdi mdi-image</v-icon>
									</span>
									<div class="flex-3">
										<div>{{ odt.pdt_name}} / {{ odt.op_name }}</div>
										<div class="mt-10 justify-space-between">
											<span class="color-blue">{{ odt.odt_price | makeComma }} 원</span>
											<span>{{ odt.op_cnt }}개</span>
										</div>
										<div class="mt-10 justify-space-between">
											<span
												class="flex-1">{{ odt.odt_status_name }}</span>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<Modal
			:is_modal="is_modal"
			:option="modal_option"

			@click="toCancel"
			@close="is_modal = !is_modal"
		>
			<div
				slot="modal-bottom"
				class="justify-space-between"
			>
				<button
					class="btn btn-danger"
					@click="toCancel"
				>주문 취소</button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Modal from "@/components/Modal";
	export default{
		name: 'OrderList'
		,
		components: {Modal},
		props: ['Axios', 'member_info', 'TOKEN']
		,data: function() {
			return {
				program: {
					name: '주문내역'
					, top: false
					, title: true
					, bottom: true
				}
				,search: {
					TOKEN: this.TOKEN
					,sDate: ''
					,eDate: ''
				}
				,items: [

				]
				,is_modal: false
				,modal_option: {
					top: true
					,title: '주문 취소'
					,content: '해당 주문을 취소하시겠습니까?'
					,bottom: true
				}
				,cancel_item: ''
			}
		}

		,computed: {
			item_list: function(){
				const self = this
				return this.items.filter(function(item){
					item.TOKEN = self.TOKEN
					item.is_cancel = true

					switch (item.o_status){
						default: case "1":
							item.o_status_name = "입금 대기"
							item.o_status_color = ""
							break;

						case "2":
							item.o_status_name = "결제완료"
							item.o_status_color = "color-green"
							break
						case "3":
							item.o_status_name = "취소 요청"
							item.o_status_color = "color-orange"
							item.is_cancel = false
							break
						case "4":
							item.o_status_name = "주문 취소"
							item.o_status_color = "color-red"
							item.is_cancel = false
							break;
					}
					item.odt_list.filter(function(odt){
						odt.odt_price = Number(odt.pdt_price) + Number(odt.op_price)
						switch (odt.odt_status){
							default: case 1:
								odt.odt_status_name = '주문접수'
								break
							case 2:
								odt.odt_status_name = '배송준비중'
								item.is_cancel = false
								break
							case 3:
								odt.odt_status_name = '배송중'
								item.is_cancel = false
								break
							case 4:
								odt.odt_status_name = '배송완료'
								item.is_cancel = false
								break
							case 5:
								odt.odt_status_name = '구매확정'
								item.is_cancel = false
								break
							case 21:
								odt.odt_status_name = '주문 취소 요청'
								item.is_cancel = false
								break
							case 22:
								odt.odt_status_name = '주문 취소 완료'
								item.is_cancel = false
								break
							case 31:
								odt.odt_status_name = '교환 요청'
								item.is_cancel = false
								break
							case 32:
								odt.odt_status_name = '교환 처리중'
								item.is_cancel = false
								break
							case 33:
								odt.odt_status_name = '교환 배송중'
								item.is_cancel = false
								break
							case 34:
								odt.odt_status_name = '교환 완료'
								item.is_cancel = false
								break
							case 41:
								odt.odt_status_name = '반품 요청'
								item.is_cancel = false
								break
							case 42:
								odt.odt_status_name = '반품 처리중'
								item.is_cancel = false
								break
							case 43:
								odt.odt_status_name = '반품 완료'
								item.is_cancel = false
								break
						}
					})
					return item
				})
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/getOrderList'
						,data: this.search
					})

					if(result.success){
						this.items = result.data.result.result
						this.$emit('setNotify', { type: 'success', message: result.message })
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch(e){
					console.log(e)
				}
			}
			,toResult: function(order_number){
				this.$router.push({ name: 'OrderResult', params: { order_number: order_number }})
			}
			,viewCancel: function(item, index){
				this.is_modal = true
				item.index = index
				this.cancel_item = item

				console.log(item)
			}
			,toCancel: async  function(){

				console.log(this.cancel_item)
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/postOrderCancel'
						,data: this.cancel_item
					})

					if(result.success){
						this.$set(this.items[this.cancel_item.index], 'o_status', result.data.item.o_status)
						this.is_modal = false
						this.$emit('setNotify', { type: 'success', message: result.message})
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message})
					}
				}catch (e) {
					console.log(e)
				}
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>
<style>
	.pdt-img img { width: 100% }
</style>