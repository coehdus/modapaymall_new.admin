<template>
	<div
		v-show="false"
	>
		<table ref="excel_table">
			<thead>
				<tr>
					<th
						v-for="(th, index) in excel_data.header"
						:key="'th_' + th.column + '_' + index"
					>{{ th.name }}</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(tr, key) in excel_data.content"
					:key="'tr_' + key"
				>
					<td
						v-for="td in excel_data.header"
						:key="'tr_' + key + '_td_' + td.column"
					>
						{{ tr[td.column] }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>

	export default{
		name: 'Excel'
		,props: ['date', 'excel_data']
		,data: function(){
			return {

			}
		}
		,methods: {
			toExcel: function(){
				let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">'
				tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
				tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
				tab_text = tab_text + '<x:Name>' + this.excel_data.name + '</x:Name>';
				tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
				tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
				tab_text = tab_text + "<table border='1px'>";
				let exportTable = this.$refs.excel_table

				tab_text = tab_text + exportTable.innerHTML;
				tab_text = tab_text + '</table></body></html>';
				//let data_type = 'data:application/vnd.ms-excel';
				let ua = window.navigator.userAgent;
				let msie = ua.indexOf("MSIE ");
				let fileName = this.excel_data.name + this.date.getToday() + '.xls'
				//Explorer 환경에서 다운로드
				if (msie > 0 ) {
					if (window.navigator.msSaveBlob) {
						let blob = new Blob([tab_text], {
							type: "application/csv;charset=utf-8;"
						});
						navigator.msSaveBlob(blob, fileName);
					}
				} else {
					let blob2 = new Blob([tab_text], {
						type: "application/csv;charset=utf-8;"
					});
					let filename = fileName;
					let elem = window.document.createElement('a');
					elem.href = window.URL.createObjectURL(blob2);
					elem.download = filename;
					document.body.appendChild(elem);
					elem.click();
					document.body.removeChild(elem);
				}
			}
		}

		,mounted() {
			this.toExcel()
		}
	}


</script>