<template>
	<div class="flex-column full-height bg-base overflow-y-auto">
		<div>
			<div class="justify-space-between">
				<GChart
					type="ComboChart"
					:data="chart_data_weekly"
					:options="chartOptions"
					class="flex-1 mr-10"
				/>
				<GChart
					type="ComboChart"
					:data="chartData"
					:options="chartOptions"
					class="flex-1 ml-10"
				/>
			</div>
		</div>
		<div
			class="full-height mt-10 justify-space-between "
		>
			<div class="full-height flex-1 overflow-y-auto mr-10 ">
				<h6 class="">이번달 정산</h6>
				<ul class="pa-10 full-height box ">
					<li
						class="ptb-10 justify-space-between"
					>
						<span>총 판매건수</span>
						<span>{{ settlement_data.total_cnt }} 건</span>
					</li>
					<li
						class="ptb-10 justify-space-between"
					>
						<span>총 판매금액</span>
						<span>{{ settlement_data.total_sale_price | makeComma}} 원</span>
					</li>
					<li
						class="ptb-10 justify-space-between"
					>
						<span>총 수익금액</span>
						<span>{{ settlement_data.total_revenue_price | makeComma }} 원</span>
					</li>
				</ul>
			</div>
			<div class="full-height flex-1 overflow-y-auto mr-10">
				<h6 class="">이번달 정산</h6>
				<ul class="pa-10 bg-base full-height box">
				</ul>
			</div>
			<div class="full-height flex-1 overflow-y-auto mr-10">
				<h6 class="">최근 문의</h6>
				<ul class="pa-10 bg-base box full-height overflow-y-auto">
					<li
						class="ptb-10 justify-space-between"
						v-for="qna in qna_item_list"
						:key="'qna_' + qna.uid"
					>
						<span>[{{ qna.is_answer }}] {{  qna.b_title  }}</span>
						<span>{{  qna.wDate | transDate('-')}}</span>
					</li>
				</ul>
			</div>
			<div class="full-height flex-1 overflow-y-auto">
				<h6 class="">이번달 정산</h6>
				<ul class="pa-10 bg-base full-height box">
					<li
						class="justify-space-between"
					>
						<span>제목</span>
						<span>등록일</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="mt-auto pa-10 box">1</div>
	</div>
</template>

<script>

import { GChart } from 'vue-google-charts'

	export default{
		name: 'Main'
		,props: ['Axios', 'TOKEN']
		,components: { GChart }
		,data: function(){
			return {
				program: {
					name: '대시보드'
					,top: true
					,title: true
					,search: false
					,bottom: false
				}
				,member_info: {

				}
				,items: [
					{}, {}, {}, {}
				]
				,item: {

				}
				,chartData: [
					['Month', '판매량', '매출', '수익'],
					['2021.09.13',  165,      938,         522],
					['2021.09.14',  135,      1120,        599],
					['2021.09.15',  157,      1160,        587],
					['2021.09.16',  139,      1110,        615],
					['2021.09.17',  136,      691,         629]
				]
				,chartOptions: {
					title : '최근 1주일 판매수익',
					height: 350,
					seriesType: 'bars',
					series: {
						0: { type: 'line'}
					}
				}
				,chart_data: []
				,settlement_data: {

				}
				,qna_items: []
			}
		}
		,computed: {
			qna_item_list: function(){
				return this.qna_items.filter(function(item){
					if(item.b_answer){
						item.is_answer = '답변완료'
					}else{
						item.is_answer = '답변대기'
					}
					return item
				})
			}
			,chart_data_weekly: function(){
				let data = [
					["판매일", "판매랑", "매출", "수익"]
				]

				this.chart_data.filter(function(item){
					data.push([
						item.date
						,Number(item.total_cnt)
						,Number(item.total_sale_price)
						,Number(item.total_revenue_price)
					])
				})

				return data
			}
		}
		,methods: {
			getData: async function(){
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getDashboard'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.chart_data = result.data.chart_data
					this.settlement_data = result.data.settlement_data
					this.qna_items = result.data.qna_list
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
				}
			}
			,goDetail(item){
				item.TOKEN = sessionStorage.getItem('delimallAT')
				this.$set(this, 'item', item)
			}
			,clear(){
				this.$set(this, 'item', {})
				this.setProgram(this.program)
			}
			,setProgram(program){
				this.$emit('onLoad', program)
			}
			,setNotify({ type, message}){
				this.$emit('setNotify', { type: type, message: message })
			}
		}
		,created: function(){
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
	
</script>

<style>

	.label { color: white; border-radius: 5px; padding: 3px 7px 3px; line-height: 12px !important; font-size: 10px;}
	.label-new { background-color: #0D47A1;}
	.label-hot { background-color: #e64a19;}
	.label-recomm { background-color: #0f9d58;}
	.label-season { background-color: #00b0ff;}
</style>
