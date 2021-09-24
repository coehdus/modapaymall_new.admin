

export const date = {

	getToday: function(point){
		let date = new Date()
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		let cPoint = ''
		if(point){
			cPoint = point
		}

		let fullDate = year + cPoint + ('0' + month).slice('-2') + cPoint + ('0' + day).slice('-2')

		return fullDate
	}
	,init: function(date, point){
		if(!date) {
			date = new Date()
		}
		let year = date.getFullYear()
		let month = ('0' + (date.getMonth() + 1)).slice('-2')
		let day = ('0' + date.getDate()).slice('-2')

		let cPoint = ''
		if(point){
			cPoint = point
		}

		let fullDate = year + cPoint+ month + cPoint + day

		return { year: year, month: month, day: day, fullDate: fullDate }
	}
	,getSearchBaseDate: function(point){

		let date = new Date()

		let year = date.getFullYear()
		let month = date.getMonth() - 3
		let day = date.getDate() + 1

		date = new Date(year, month, day)

		let cPoint = ''
		if(point){
			cPoint = point
		}

		year = date.getFullYear()
		month = ('0' + (date.getMonth() + 1)).slice('-2')
		day = ('0' + date.getDate()).slice('-2')

		let fullDate = year + cPoint + month + cPoint + day

		return fullDate
	}
	,getWeeklyDate: function(dates, point){
		let date = new Date()

		if(dates) {
			dates = dates.replaceAll('-', '')
			date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8))
		}
		let year = date.getFullYear()
		let month = date.getMonth()
		let day = date.getDate()
		let thisDay = date.getDay()

		let cPoint = ''
		if(point){
			cPoint = point
		}

		let start = new Date(year, month, day - thisDay)
		let start_year = start.getFullYear()
		let start_month = start.getMonth() + 1
		let start_day = start.getDate()
		let start_fullDate = start_year + cPoint + ('0' + start_month).slice('-2') + cPoint + ('0' + start_day).slice('-2')

		let end = new Date(year, month, day + (6 - thisDay))
		let end_year = end.getFullYear()
		let end_month = end.getMonth() + 1
		let end_day = end.getDate()
		let end_fullDate = end_year + cPoint + ('0' + end_month).slice('-2') + cPoint + ('0' + end_day).slice('-2')

		return { start: start_fullDate, end: end_fullDate}
	}

	,getMonthlyDate2: function(input, point){

		let date = new Date(input)
		let year = date.getFullYear()
		let month = date.getMonth()

		let cPoint = ''
		if(point){
			cPoint = point
		}

		let start = new Date(year, month, 1)
		let start_year = start.getFullYear()
		let start_month = start.getMonth() + 1
		let start_day = start.getDate()
		let start_fullDate = start_year + cPoint + ('0' + start_month).slice('-2') + cPoint + ('0' + start_day).slice('-2')

		let end = new Date(year, month)
		let end_year = end.getFullYear()
		let end_month = end.getMonth() + 1
		let end_day = end.getDate()

		end = new Date(end_year, end_month, end_day - 1)
		end_year = end.getFullYear()
		end_month = end.getMonth() + 1
		end_day = end.getDate()
		let end_fullDate = end_year + cPoint + ('0' + end_month).slice('-2') + cPoint + ('0' + end_day).slice('-2')

		return { start: start_fullDate, end: end_fullDate}
	}

	,getMonthlyDate: function(dates, point){

		let cPoint = ''
		if(point){
			cPoint = point
		}

		let date = new Date()
		if(dates){
			dates = dates.replaceAll('-', '')
			date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8))
		}
		let year = date.getFullYear()
		let month = date.getMonth()

		let start = new Date(year, month, 1)
		let start_year = start.getFullYear()
		let start_month = start.getMonth() + 1
		let start_day = start.getDate()
		let start_fullDate = start_year + cPoint + ('0' + start_month).slice('-2') + cPoint +('0' + start_day).slice('-2')

		let end = new Date(year, month + 1)
		let end_year = end.getFullYear()
		let end_month = end.getMonth()
		let end_day = end.getDate()

		end = new Date(end_year, end_month, end_day - 1)
		end_year = end.getFullYear()
		end_month = end.getMonth() + 1
		end_day = end.getDate()
		let end_fullDate = end_year + cPoint +('0' + end_month).slice('-2') + cPoint +('0' + end_day).slice('-2')

		return { start: start_fullDate, end: end_fullDate}
	}
	,getPrevMonth: function(dates, prev, point){

		let then = 2
		if(prev){
			then += prev
		}

		let cPoint = ''
		if(point){
			cPoint = point
		}

		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - then, dates.substring(6, 8))

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let fullDate = year + cPoint + ('0' + month).slice('-2') + cPoint + ('0' + day).slice('-2')

		return { year: year, month: month, day: day, fullDate: fullDate }
	}
	,getNextMonth: function(dates, next, point){

		let then = 0
		if(next){
			then += next
		}

		let cPoint = ''
		if(point){
			cPoint = point
		}

		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4), Number(dates.substring(4, 6)) + then, dates.substring(6, 8))

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()


		let fullDate = year + cPoint + ('0' + month).slice('-2') + cPoint + ('0' + day).slice('-2')

		return { year: year, month: month, day: day, fullDate: fullDate }
	}
	,getPrevWeelkyDate: function(dates, point){

		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8) - 1)

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		return this.getWeeklyDate(year + ('0' + month).slice('-2') + ('0' + day).slice('-2'), point)
	}

	,getNextWeelkyDate: function(dates, point){

		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, Number(dates.substring(6, 8)) + 1)

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		return this.getWeeklyDate(year + ('0' + month).slice('-2') + ('0' + day).slice('-2'), point)
	}
	,getYearlyDate: function(dates){
		let date = new Date()

		if(dates) {
			dates = dates.replaceAll('-', '')
			date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8))
		}

		let year = date.getFullYear()
		let month = date.getMonth()
		let day = date.getDate()

		let start = new Date(year, month, day)
		let start_year = start.getFullYear()
		let start_month = 1
		let start_day = 1
		let start_fullDate = start_year + ('0' + start_month).slice('-2') + ('0' + start_day).slice('-2')

		let end = new Date(year, month, day)
		let end_year = end.getFullYear()
		let end_month = 12
		let end_day = 31
		let end_fullDate = end_year + ('0' + end_month).slice('-2') + ('0' + end_day).slice('-2')

		return { start: start_fullDate, end: end_fullDate}
	}
	,getPrevYearlyDate: function(dates){
		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4) - 1, dates.substring(4, 6) - 1, dates.substring(6, 8))

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		return this.getYearlyDate(year + ('0' + month).slice('-2') + ('0' + day).slice('-2'))
	}
	,getNextYearlyDate: function(dates){

		dates = dates.replaceAll('-', '')
		let date = new Date(Number(dates.substring(0, 4)) + 1, dates.substring(4, 6) - 1, Number(dates.substring(6, 8)) + 1)

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		return this.getYearlyDate(year + ('0' + month).slice('-2') + ('0' + day).slice('-2'))
	}
	// 하루 전날짜 가져오기
	,getPrevDay: function(dates, point){
		if(!dates){
			return ''
		}
		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8))
		date.setDate(date.getDate() - 1);
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		let cPoint = ''
		if(point){
			cPoint = point
		}

		let fullDate = year + cPoint + ('0' + month).slice('-2') + cPoint + ('0' + day).slice('-2')

		return fullDate
	}
	// 하루 다음날짜 가져오기
	,getNextDay: function(dates, point){

		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8))
		date.setDate(date.getDate() + 1);
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		let cPoint = ''
		if(point){
			cPoint = point
		}

		let fullDate = year + cPoint + ('0' + month).slice('-2') + cPoint + ('0' + day).slice('-2')

		return fullDate
	}
	// 20210705 포멧을 2021년 07월 05일 포멧으로 변경
	,getHanguelDate: function(dates){

		if(!dates){
			return ''
		}
		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8))

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let fullDate = year + '년 ' + ('0' + month).slice('-2') + '월 ' + ('0' + day).slice('-2') + '일'

		return fullDate
	}
	// 20210705 포멧을 2021-07-05 포멧으로 변경
	,getSearchDate: function(dates, point){
		if(!dates){
			return ''
		}

		dates = dates.replaceAll('-', '')
		let cPoint = ''
		if(point){
			cPoint = point
		}
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8))

		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let fullDate = year + cPoint + ('0' + month).slice('-2') + cPoint + ('0' + day).slice('-2')

		return fullDate
	}

	,getLastWeekDate: function(dates, point){
		if(!dates){
			return ''
		}
		dates = dates.replaceAll('-', '')
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 1, dates.substring(6, 8))
		date.setDate(date.getDate() - 6);
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		let cPoint = ''
		if(point){
			cPoint = point
		}

		let fullDate = year + cPoint + ('0' + month).slice('-2') + cPoint + ('0' + day).slice('-2')

		return fullDate
	}

}