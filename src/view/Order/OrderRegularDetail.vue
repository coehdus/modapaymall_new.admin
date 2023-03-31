<template>
	<div class="full-height">
		<div
			class="justify-space-between full-height overflow-y-auto"
		>
			<div class="flex-1 bg-white pa-10 mr-10 ">
				<h6 class="under-line-identify">정기결제 상품 정보</h6>
				<table class="table">
					<col width="120px" />
					<col width="auto" />
					<col width="120px" />
					<col width="auto" />
					<tbody>
					<tr>
						<th>아이디</th>
						<td>{{ item_regular.member_id }}</td>
						<th>이름</th>
						<td>{{ item_regular.member_name }}</td>
					</tr>
					<tr>
						<th>결제 카드</th>
						<td>{{ item_regular.bill_name }} </td>
						<th>결제 금액</th>
						<td>{{ item_regular.order_price | makeComma}}원</td>
					</tr>
					<tr>
						<th>결제일</th>
						<td>매월 {{ item_regular.regular_date }}일</td>
						<th>기간</th>
						<td> {{ item_regular.regular_rate }}개월</td>
					</tr>
					<tr>
						<th>상품 정보</th>
						<td colspan="3">
							<div class="flex-row items-center">
								<div class="square-100 mr-10">
									<img
										v-if="!item_regular.is_error"
										:src="$pdt_img_url + item_regular.pdt_img" class="width-100" @error="item_regular.is_error = true"/>
									<v-icon
										v-else
									>mdi-image-area</v-icon>
								</div>
								<div class=" flex-column text-left">
									<div>{{ item_regular.pdt_name }}</div>
								</div>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="flex-1 bg-white pa-10 mr-10 ">
				<h6 class="under-line-identify">정기결제 정보</h6>
				<div>
					<table
						class="table mb-10"
					>
						<col width="120px" />
						<col width="auto" />
						<tbody>
						<tr>
							<th>첫 주문</th>
							<td>{{ item_regular.order_number }}</td>
						</tr>
						<tr>
							<th>결제일</th>
							<td>{{ item_regular.wDate }}</td>
						</tr>
						<tr>
							<th>결제금액</th>
							<td>{{ item_regular.order_price | makeComma }}원</td>
						</tr>
						</tbody>
					</table>
					<table
						class="table mb-10"
						v-for="(order, index) in item_regular.order_list"
						:key="'order_' + index"
					>
						<col width="120px" />
						<col width="auto" />
						<tbody>
						<tr>
							<th>{{ index + 1}} 회차</th>
							<td>{{ order.order_number }}</td>
						</tr>
						<tr>
							<th>결제일</th>
							<td>{{ order.wDate }}</td>
						</tr>
						<tr>
							<th>결제금액</th>
							<td>{{ order.order_price | makeComma }}원</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div
			class="mt-10 justify-center"
		>
			<button
				class="box pa-10-20"
				@click="toList"
			>목록</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OrderRegularDetail'
	, props: ['Axios']
	, data: function(){
		return {
			program: {
				name: '정기결제 상세'
				,top: true
				,title: true
				,bottom: false
			}
			, item_regular: {

			}
		}
	}
	, methods: {
		getData: async function(){
			try{
				this.$bus.$emit('on', true)
				const result = await this.Axios({
					method: 'get'
					,url: 'management/getOrderRegularInfo'
					,data: {
						uid: this.$route.params.idx
					}
				})

				if(result.success){
					this.item_regular = result.data
				}else{
					throw result.message
				}
			}catch(e){
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: e })
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, toList: function(){
			this.$router.back()
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>