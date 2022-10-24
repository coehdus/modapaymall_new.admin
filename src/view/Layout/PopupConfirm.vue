<template>
	<div class="full_layer_wrap">
		<div class="full_layer_container">
			<div
				class="bg-white flex-row "
			>
				<article
					class="full_view"
				>
					<div>
						<h6 class="text-center pa-10"><slot name="title"></slot></h6>
						<div class="under-line"><span class="hide">구분선</span></div>
						<div class="pa-30">
							<p class="font-weight-bold"><slot name="main-txt"></slot></p>
							<p class="mt-10"><slot name="sub-txt"></slot></p>
						</div>
						<slot name="content"></slot>
					</div>

					<div
						class="flex-row"
					>
						<button
							v-if="!not_cancel"
							@click="$emit('cancel')"
							class="flex-1 btn btn-gray"
						><slot name="name-cancel">취소</slot></button>
						<button
							@click="$emit('click')"
							class="flex-1 btn btn-confirm"
						><slot name="name-confirm">확인</slot></button>
					</div>
				</article>
			</div>
		</div>
		<div class="bg_overlay"></div>
	</div>
</template>

<script>
export default {
	name: 'popup_confirm'
	, props: ['type', 'not_cancel']
	, data: function(){
		return {

		}
	}
}
</script>

<style>
.full_layer_wrap{
	position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999
}

.full_layer_wrap .bg_overlay{
	position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: black; opacity: 0.5
}

.full_layer_wrap .full_layer_container{
	position: relative;
	height: 100%;
	background: none;
	display: flex;
	flex-direction: column;
	justify-content: center;
	z-index: 9999;
	align-items: center;
}
</style>