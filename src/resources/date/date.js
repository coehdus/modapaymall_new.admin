

export const date = {
	
	getToday: function(){
		let date = new Date()
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		
		let fullDate = year + ('0' + month).slice('-2') + ('0' + day).slice('-2')
		
		return fullDate
	}
	,init: function(){
		let date = new Date()
		let year = date.getFullYear()
		let month = ('0' + (date.getMonth() + 1)).slice('-2')
		let day = ('0' + date.getDate()).slice('-2')
		
		let fullDate = year + month + day
		
		return { year: year, month: month, day: day, fullDate: fullDate }
	}
	,getSearchBaseDate: function(){
		
		let date = new Date()
		
		let year = date.getFullYear()
		let month = date.getMonth() - 3
		let day = date.getDate() + 1
		
		date = new Date(year, month, day)
		
		
		year = date.getFullYear()
		month = ('0' + (date.getMonth() + 1)).slice('-2')
		day = ('0' + date.getDate()).slice('-2')
		
		let fullDate = year + month + day
		
		return fullDate
	}
	,getWeeklyDate: function(){
		let date = new Date()
		let year = date.getFullYear()
		let month = date.getMonth()
		let day = date.getDate()
		let thisDay = date.getDay()
		
		let start = new Date(year, month, day - thisDay)
		let start_year = start.getFullYear()
		let start_month = start.getMonth() + 1
		let start_day = start.getDate()
		let start_fullDate = start_year + ('0' + start_month).slice('-2') + ('0' + start_day).slice('-2')
		
		let end = new Date(year, month, day + (6 - thisDay))
		let end_year = end.getFullYear()
		let end_month = end.getMonth() + 1
		let end_day = end.getDate()
		let end_fullDate = end_year + ('0' + end_month).slice('-2') + ('0' + end_day).slice('-2')
		
		return { start: start_fullDate, end: end_fullDate}
	}
	
	,getMonthlyDate: function(){
		let date = new Date()
		let year = date.getFullYear()
		let month = date.getMonth()
		
		let start = new Date(year, month, 1)
		let start_year = start.getFullYear()
		let start_month = start.getMonth() + 1
		let start_day = start.getDate()
		let start_fullDate = start_year + ('0' + start_month).slice('-2') + ('0' + start_day).slice('-2')
		
		let end = new Date(year, month + 1)
		let end_year = end.getFullYear()
		let end_month = end.getMonth()
		let end_day = end.getDate()
		
		end = new Date(end_year, end_month, end_day - 1)
		end_year = end.getFullYear()
		end_month = end.getMonth() + 1
		end_day = end.getDate()
		let end_fullDate = end_year + ('0' + end_month).slice('-2') + ('0' + end_day).slice('-2')
		
		return { start: start_fullDate, end: end_fullDate}
	}
	,getPrevMonth: function(dates){
		
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6) - 2, dates.substring(6, 8))
		
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let fullDate = year + ('0' + month).slice('-2') + ('0' + day).slice('-2')
		
		return { year: year, month: month, day: day, fullDate: fullDate }
	}
	,getNextMonth: function(dates){
		
		let date = new Date(dates.substring(0, 4), dates.substring(4, 6), dates.substring(6, 8))
		
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		
		let fullDate = year + ('0' + month).slice('-2') + ('0' + day).slice('-2')
		
		return { year: year, month: month, day: day, fullDate: fullDate }
	}
	
}