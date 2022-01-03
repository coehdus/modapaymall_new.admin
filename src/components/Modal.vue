<template>
	<transition
		name="fade"
	>
		<div
			v-if="is_modal"
			class="modal-wrap"
		>
			<div
				class="modal-bg"

				@click="close"
			></div>
			<div
				class="modal-container"
				:style="options.width ? 'width: ' + options.width + ' !important' : ';' + width ? 'width: ' + width + ' !important' : ''"
			>
				<div
					class="modal-content flex-column "
					:style="height ? 'height: ' + height : ''"
				>
					<template
						v-if="options.top || top"
					>
						<slot name="modal-title">
							<div
								class="modal-top bg-base"
							>
								<strong class="size-px-16">{{ title ? title : options.title }}</strong>
								<button
									class="modal-btn-close"
									@click="close"
								><v-icon >mdi-close-circle</v-icon></button>
							</div>
						</slot>
					</template>

					<div
						class="modal-contents full-height bg-white "
						:class="[options.content_class, content_class]"
					><slot name="modal-content">{{ is_content ? is_content : options.content }}</slot></div>
				</div>

				<div
					v-if="options.bottom || bottom"
					class="modal-bottom "
					:class="class_bottom"
				>
					<slot
						v-if="options.slot_bottom || slot_bottom"
						name="modal-bottom">{{ options.bottom }}</slot>
					<template
						v-else
					>
						<button
							v-if="!options.is_click"
							class="pa-10-20"
							:class="class_click"
							@click="click"
						>{{ name_click }}</button>
						<button
							v-if="!options.is_cancel"
							class="pa-10-20 "
							:class="class_cancel"
							@click="cancel"
						>{{ name_cancel }}</button>
					</template>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'modal'
	,props: ['option', 'is_modal', 'bottom_class', 'click_class', 'cancel_class', 'click_name', 'cancel_name', 'height', 'width', 'content_class', 'bottom', 'top', 'title', 'content', 'content_html', 'slot_bottom']
	,data: function(){
		return {
			options: this.option ? this.option : {}
		}
	}
	,computed: {
		class_bottom: function(){
			let class_name = ''
			if(this.bottom_class){
				class_name = this.bottom_class
			}else if(this.options.bottom_class){
				class_name = this.options.bottom_class
			}else{
				class_name = 'justify-space-between'
			}

			return class_name
		}
		,class_click: function(){
			let class_name = ''
			if(this.click_class){
				class_name = this.click_class
			}else if(this.options.click_class){
				class_name = this.options.click_class
			}else{
				class_name = 'bg-identify flex-1'
			}

			return class_name
		}
		,class_cancel: function(){
			let class_name = ''
			if(this.cancel_class){
				class_name = this.cancel_class
			}else if(this.options.cancel_class){
				class_name = this.options.cancel_class
			}else{
				class_name = 'btn-default flex-1'
			}

			return class_name
		}
		,name_click: function(){
			let class_name = ''
			if(this.click_name){
				class_name = this.click_name
			}else if(this.options.click_name){
				class_name = this.options.click_name
			}else{
				class_name = '확인'
			}

			return class_name
		}
		,name_cancel: function(){
			let class_name = ''
			if(this.cancel_name){
				class_name = this.cancel_name
			}else if(this.options.cancel_name){
				class_name = this.options.cancel_name
			}else{
				class_name = '취소'
			}

			return class_name
		}
		, is_content: function(){
			let content = this.content ? this.content : this.options.content

			return content

		}
	}
	,methods: {
		close: function(){
			this.$emit('close')
		}
		,click: function(){
			this.$emit('click')
		}
		,cancel: function(){
			this.$emit('cancel')
		}
	}
	,created() {
	}
	,watch: {
		option: {
			deep: true
			,handler: function(){
				this.show = true
			}
		}
	}
}
</script>

<style>
.modal-wrap { position: fixed; top: 0; left: 0; z-index: 999; width: 100%; height: 100%; }
.modal-wrap .modal-bg {position: absolute; width: 100%; height: 100%; background: black; opacity: 0.5;  cursor: not-allowed }
.modal-wrap .modal-container { position: relative; z-index: 998; padding: 20px; display: flex; flex-direction: column; justify-content: center; height: 100%; cursor: not-allowed }
.modal-wrap .modal-container .modal-content {width: 100%; background-color: #eee; padding: 0; border-radius: 5px 5px 0 0;
	overflow: auto;  display: flex; flex-direction: column; cursor: auto; color: #2A2A2A}
.modal-wrap .modal-container .modal-content .modal-top { padding: 10px; border-bottom: 1px solid #bbb;}
.modal-wrap .modal-container .modal-content .modal-contents {padding: 10px; overflow: auto; text-align: center; }
.modal-wrap .modal-container .modal-content .modal-bottom { margin-top: auto; padding: 0; }
.modal-btn-close { float: right; padding: 0; height: auto;}

.modal-wrap .modal-container .modal-bottom {padding: 0; border-radius: 0 0 5px 5px; background-color: white;}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>

