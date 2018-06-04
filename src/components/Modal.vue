<!-- Forge source code is distributed under the MIT license. -->

<template>
	<div id='overlay'>

		<div class='centered-content'>
			<p>
				{{message}}
			</p>
			<div class='options'>
				<StandardButton
					v-for='item in options'
					v-bind:label='item.name'
					v-bind:key='item.name'
					v-on:click='item.action'
				/>
			</div>
		</div>
	</div>
</template>

<script>
import StandardButton from "./buttons/StandardButton.vue";
export default {
	name: "Play",
	components: {
		StandardButton
	},
	props: [ "message", "options" ],
	data() {
		return {};
	},
	methods: {}
};
</script>

<style scoped>
	#overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.centered-content {
		border: 1px solid grey;
		background-color: white;
		width: 256px;
		height: 128px;
		padding: 16px;
		background-color: blue;
		display: flex;
		flex-direction: column;
	}
	.centered-content p {
		flex: 1 auto;
	}
	.options {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}
</style>
