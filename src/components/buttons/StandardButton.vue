<template>
	<button class='menu-button' v-on:click='$emit("click")' v-on:mouseover='hover'>
		{{label}}
	</button>
</template>

<script>
export default {
	props: [ "label" ],
	data() {
		return {
			text: "Hola"
		};
	},
	methods: {
		hover() {
			const sfx = new Audio( "../../resources/sounds/button-hover.wav" );
			sfx.play();
		}
	}
};
</script>

<style scoped>
	.menu-button {
		min-width: 80px;
		display: block;
		height: 32px;
		box-sizing: border-box;
		padding: 7px;
		line-height: 16px;
		font-size: 13px;
		background: transparent;
		border: solid 1px grey;
		color: grey;
		border-radius: 4px;
	}
</style>
