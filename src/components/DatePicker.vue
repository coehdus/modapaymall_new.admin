<template>
	<div style="display: inline-block;" class="cursor-pointer vertical-middle">

		<div
			class="flex-column justify-center"
		>
			<div>
				<v-icon
					v-if="false"
					class="mr-5" @click="is_view = true">mdi-calendar-month</v-icon>
				<v-icon @click="prev" class="size-px-28">mdi-chevron-left-box</v-icon>
				<input class="box pa-5-10 bg-white text-center width-50 cursor-pointer" :value="date_picker.date" readonly @click="is_view = true">
				<v-icon @click="next" class="size-px-28">mdi-chevron-right-box</v-icon>
			</div>
		</div>

		<div
			v-if="is_view"
			style="position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 9999"
		>
			<div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 998; background-color: black; opacity: 0.5"></div>
			<div
				style="position: relative; height: 100%; background: none; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 999"
			>
				<v-date-picker
					v-model="date_picker.date"
					no-title
					scrollable
					@change="setDate"
				></v-date-picker>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'date_picker'
	, props: ['date']
	, data: function(){
		return {
			date_picker: {
				date: this.date ? this.date : this.$date.getToday('-')
			}
			, is_view: false
		}
	}
	, computed: {

	}
	, methods: {
		setDate: function(date){
			this.$emit('click', date)
			this.is_view = false
		}
		, next: function(){
			if(this.date_picker.date){
				this.date_picker.date = this.$date.getNextDay(this.date_picker.date,'-')
				this.setDate(this.date_picker.date)
			}
		}
		, prev: function(){
			if(this.date_picker.date){
				this.date_picker.date = this.$date.getPrevDay(this.date_picker.date, '-')
				this.setDate(this.date_picker.date)
			}
		}
	}
	, created() {
	}
}
</script>

<style>
.v-date-picker-table .v-btn.v-btn--active { color: black !important;}
</style>