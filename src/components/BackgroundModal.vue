<template>
	<transition
		name="fade"
	>
		<div
			style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999"
		>
			<div
				style="position: absolute; width: 100%; height: 100%; background-color: black; opacity: 0.5"
			></div>
			<div
				style="position: relative; height: 100%; background: none; display: flex; flex-direction: column; justify-content: center; z-index: 9999; align-items: center"
			>
				<slot name="contents"></slot>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Loading'
	,props: ['is_loading']
	,data: function(){
		return {

		}
	}
	,mounted() {

	}
}
</script>

<style>

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>