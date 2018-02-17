<template>
	<button class='menu-button' v-on:click='$emit("click")' v-on:mouseover='hover'>
		{{label}}
	</button>
</template>

<script>
	export default {
		props: ["label"],
		data(){
			return {
				text: "Hola"
			}
		},
		methods: {
			hover() {
				const sfx = new Audio('../ui/sounds/button-hover.wav');
				sfx.play();
			}
		}
	}
</script>

<style scoped>
	.menu-button {
		width: 100%;
		display: block;
		height: 32px;
		margin-bottom: 8px;
		text-align: left;
		box-sizing: border-box;
		padding: 8px;
		line-height: 16px;
		font-size: 13px;
	}
	.menu-button:last-child {
		margin-bottom: 0;
	}
</style>
