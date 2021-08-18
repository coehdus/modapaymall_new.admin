<template>
	<div class="flex-column full-height bg-gray-light">
		<div class="main-pdt pa-10 full-height  overflow-y-auto">
			<div
				v-for="item in items"
				:key="item.pdt_uid"
				class="main-box-pdt box-shadow mb-30"
			>
				<div class="pdt-img pa-30 under-line"><img src="" width="100%"/><v-icon class="mdi mdi-image none-img"></v-icon></div>
				<div class="pdt-info pa-10 flex-row justify-space-between">
					<span class="pdt-title">pdt-title</span>
					<span class="price">pdt-price</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	

	export default{
		name: 'Main'
		,
		components: {},
		props: ['Axios']
		,data: function(){
			return {
				program: {
					name: '딜리몰'
					,top: true
					,title: false
					,bottom: true
				}
				,member_info: {

				}
				,cart_cnt: 0
				,items: [
					{}, {}, {}, {}
				]
			}
		}
		,methods: {
		}
		,created: function(){
			this.$emit('onLoad', this.program)
		}
	}
	
</script>

<style>
.logo-position {

}
.header-box-menu {
	border-bottom: 1px solid #ddd;
}

.icon-box {
	padding: 5px;
	border: 1px solid #ddd;
}

.cart-count {
	position: absolute;
	right: 2px;
	top: 2px;
	background-color: #0093e2;
	border: 1px solid #ddd;
	border-radius: 5px;
	color: white;
	font-size: 12px;
	padding: 3px 5px;
	line-height: 100%;
}


.company-list {
	font-family: "\B9D1\C740 \ACE0\B515",Malgun Gothic,Apple-Gothic,Helvetica,Dotum,\\B3CB\C6C0,Gulim
}

.cart-none-list {
	display: none;
}

.main-box-pdt { background-color: white; border-radius: 10px 0px 0px 0px;}

.box-shadow-top { box-shadow: 0px 3px 6px black}
.box-shadow-inset { box-shadow: 0px 0px 2px 1px #bbb inset}
.box-shadow { box-shadow: 1px 1px 3px 1px #bbb}

.border-tb { border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;}
.border-lr { border-left: 1px solid #ddd; border-right: 1px solid #ddd;}


.bg-base { background-color: #0165fa}
</style>
