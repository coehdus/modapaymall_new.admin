<template>
	<transition
		name="fade"
	>
		<div
			v-if="show"
			class="modal-wrap"
		>
			<div
				class="modal-bg"
			></div>
			<div
				class="modal-container"
				:style="option.width ? 'width: ' + option.width + ' !important' : ''"
			>
				<div
					class="modal-content bg-base"
				>
					<template

						v-if="option.top"
					>
						<slot name="modal-title">
							<div
								class="modal-top"
							>
								<strong class="size-px-16">{{ option.title }}</strong>
								<button
									class="modal-btn-close"
									@click="close"
								><v-icon class="color-icon">mdi-close-circle</v-icon></button>
							</div>
						</slot>
					</template>

					<div
						class="modal-contents"
					><slot name="modal-content">{{ option.content }}</slot></div>
				</div>

				<div
					v-if="option.bottom"
					class="modal-bottom"
				><slot name="modal-bottom">{{ option.bottom }}</slot></div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'modal'
	,props: ['option', 'is_modal']
	,data: function(){
		return {
			show: this.is_modal
		}
	}
	,methods: {
		close: function(){
			this.$emit('close')
		}
	}
	,watch: {
		option: {
			deep: true
			,handler: function(){
				this.show = true
			}
		}
		,is_modal: {
			handler: function(call){
				this.show = call
			}
		}
	}
}
</script>

<style>
.modal-wrap { position: fixed; top: 0; left: 0; z-index: 999; width: 100%; height: 100%;}
.modal-wrap .modal-bg {position: absolute; width: 100%; height: 100%; background: black; opacity: 0.5;}
.modal-wrap .modal-container { position: relative; z-index: 998; padding: 20px; display: flex; flex-direction: column; justify-content: center; height: 100%;}
.modal-wrap .modal-container .modal-content {width: 100%; background-color: white; padding: 0; border-radius: 5px 5px 0 0;
	overflow: auto;  display: flex; flex-direction: column; }
.modal-wrap .modal-container .modal-content .modal-top { padding: 10px; border-bottom: 1px solid #bbb;}
.modal-wrap .modal-container .modal-content .modal-contents {padding: 10px; overflow: auto; text-align: center; margin: 40px auto}
.modal-wrap .modal-container .modal-content .modal-bottom { margin-top: auto; padding: 0; }
.modal-btn-close { float: right; padding: 0; height: auto;}

.modal-wrap .modal-container .modal-bottom { border-radius: 0 0 5px 5px; background-color: white}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>

