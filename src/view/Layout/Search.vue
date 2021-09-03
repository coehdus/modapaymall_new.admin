<template>
	<div class=" ptb-10 bg-white justify-space-between">

		<div
			v-show="option.is_cnt"
			class="ml-10 flex-column justify-center"
		>
			<span >총 <span class="font-weight-bold color-red size-em-12 ">{{ option.tCnt | makeComma }}</span> 건</span>
		</div>

		<div class="flex-1 text-right">
			<input
				v-if="option.sDate"
				v-model="search.sDate"
				class="pa-5 box vertical-middle mr-10 "
				placeholder="검색 시작일"
			/>

			<span
				v-if="option.sDate && option.eDate"
			>
				~
			</span>

			<input
				v-if="option.eDate"
				v-model="search.eDate"
				class="pa-5 box vertical-middle mr-10 "
				placeholder="검색 종료일"
			/>

			<template
				v-for="(select, index) in option.select"
			>
				<select
					:key="'select_' + index"
					v-model="search[select.column]"
					class="pa-5 box vertical-middle mr-10 "
					@change="$emit('click')"
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
				class="pa-5 mr-10"
				v-model="search.list_cnt"
			>
				<option
					v-for="cnt in list_cnt"
					:key="'cnt_' + cnt"
					:value="cnt"
				>{{ cnt }} 건씩 보기</option>
			</select>

			<select
				class="pa-5 mr-10"
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
				class="pa-5 box vertical-middle mr-10 "
				placeholder="검색어를 입력하세요"
			/>

			<button
				class="btn-blue pa-5 prl-10 vertical-middle mr-10"
				@click="$emit('click')"
			>검색</button>

			<button
				v-if="option.is_excel"
				class="btn-green pa-5 prl-10 vertical-middle mr-10"
				@click="$emit('toExcel')"
			>EXCEL</button>

			<button
				v-if="option.is_item"
				class="btn-green pa-5 prl-10 vertical-middle mr-10"
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
			}
		}
		,methods:{

		}
	}
</script>