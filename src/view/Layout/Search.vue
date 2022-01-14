<template>
	<div class=" ptb-10 box justify-space-between">

		<div
			v-show="option.is_cnt"
			class="ml-10 flex-column justify-center"
		>
			<span >총 <span class="font-weight-bold color-red size-em-12 ">{{ option.tCnt | makeComma }}</span> 건</span>
		</div>

		<div class="flex-1 text-right">

			<span class="position-relative" style="z-index: 1">
			<input
				v-if="option.sDate"
				v-model="search.sDate"
				class="pa-5-10 box vertical-middle mr-10 "
				placeholder="검색 시작일"

				@click="clear(); search.sDate = ''; datePickerStart = !datePickerStart"
			/>

			<v-date-picker
				v-if="datePickerStart"
				v-model="search.sDate"
				no-title
				scrollable
				class="position-absolute "
				style="top: 30px; left: -95px; z-index: 2"
				@change="clear"
			></v-date-picker>
			</span>

			<span
				v-if="option.sDate && option.eDate"
			>
				~
			</span>

			<span class="position-relative" style="z-index: 1">
			<input
				v-if="option.eDate"
				v-model="search.eDate"
				class="pa-5-10 box vertical-middle mr-10 "
				placeholder="검색 종료일"

				@click="clear(); search.eDate = ''; datePickerEnd = !datePickerEnd"
			/>

			<v-date-picker
				v-if="datePickerEnd"
				v-model="search.eDate"
				no-title
				scrollable
				class="position-absolute "
				style="top: 30px; left: -95px;"
				@change="clear"
			></v-date-picker>
			</span>

			<slot
				name="add"
			></slot>

			<template
				v-for="(select, index) in option.select"
			>
				<select
					:key="'select_' + index"
					v-model="search[select.column]"
					class="pa-5-10 box vertical-middle mr-10 "
					@change="$emit('click', 1)"
				>
					<option
						:value="''"
					>{{ select.name }}</option>
					<option
						v-for="(item, item_index) in select.items"
						:key="'select_' + index + '_item_' + item_index"
						:value="item.column"
					>{{ item.name }}</option>
				</select>
			</template>

			<select
				class="pa-5-10 mr-10"
				v-model="search.list_cnt"
				@change="$emit('click', 1)"
			>
				<option
					v-for="cnt in list_cnt"
					:key="'cnt_' + cnt"
					:value="cnt"
				>{{ cnt }} 건씩 보기</option>
			</select>

			<select
				class="pa-5-10 mr-10"
				v-model="search.search_type"
			>
				<option
					:value="''"
				>검색조건</option>
				<option
					v-for="type in option.search_type"
					:key="'search_type_' + type.column"
					:value="type.column"
				>{{ type.name }}</option>
			</select>

			<input
				v-model="search.search_value"
				class="pa-5-10 box vertical-middle mr-10 "
				placeholder="검색어를 입력하세요"
				@keyup.enter="$emit('click', 1)"
			/>

			<button
				class="btn-blue pa-5-10 vertical-middle mr-10"
				@click="$emit('click', 1)"
			>검색</button>

			<button
				v-if="option.is_excel"
				class="btn-green pa-5-10 vertical-middle mr-10"
				@click="$emit('toExcel')"
			>EXCEL</button>

			<button
				v-if="option.is_item"
				class="btn-green pa-5-10 vertical-middle mr-10"
				@click="$emit('toItem')"
			>등록</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Search'
		,props: ['search', 'option']
		,components: {}
		,data: function(){
			return {
				list_cnt: [10, 20, 30, 50, 100, 200]
				,datePickerStart: false
				,datePickerEnd: false
			}
		}
		,methods:{
			clear: function(){
				this.datePickerStart = false
				this.datePickerEnd = false
			}
		}
	}
</script>

<style>
.v-picker__body {border: 1px solid #bbb;}
.v-btn--active {background-color: #0f6ecd}
</style>