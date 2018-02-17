<template>
	<div id='plugins'>


		<div id='inactive' class='pane'>


		</div>

		<button>
			Move
		</button>

		<div id='active' class='pane'>


		</div>

		<button @click='$emit("switchView", "MainMenu")'>
			Back
		</button>

		<button @click='$emit("switchView", "MainMenu")'>
			Save
		</button>
	</div>
</template>

<script>
	export default {
		name: "Plugins",
		data() {
			return {};
		}
	}
</script>

<style>
	#plugins {

	}
	.pane {
		width: 300px;
		height: 300px;
		border: solid 1px #495057;
		border-radius: 4px;
		margin: 16px;
		padding: 4px;
	}
</style>
