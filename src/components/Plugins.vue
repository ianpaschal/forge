<template>
	<div id='plugins'>

		<div class='centered'>

			<div class='title'>Manage Plugins</div>
			<div class='panes'>
				<div id='inactive' class='pane'>
					<h3>Installed Plugins</h3>
					<ul>
						<li>Plugin 1</li>
						<li>Plugin 2</li>
						<li>Plugin 3</li>
					</ul>
				</div>
				<button id='button-move'>
					->
				</button>
				<div id='active' class='pane'>
					<h3>Active Plugins</h3>
					<ul>
						<li>Plugin 1</li>
						<li>Plugin 2</li>
						<li>Plugin 3</li>
					</ul>
				</div>
			</div>
			<div class='buttons'>
				<StandardButton v-bind:label='"Back"' @click='$store.commit("view", "MainMenu")'/>
				<StandardButton v-bind:label='"Save"' @click='save'/>
			</div>
		</div>
	</div>
</template>

<script>
import StandardButton from "./buttons/StandardButton.vue";
export default {
	name: "Plugins",
	components: {
		StandardButton
	},
	data() {
		return {};
	},
	methods: {
		save() {
			// this.$store.dispatch( "buildLoadStack" );
		}
	}
};
</script>

<style scoped>
	.centered {
		display: flex;
		flex-direction: column;
	}
	.title {
		padding: 8px;
	}
	.panes {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 8px;
	}
	.pane {
		width: 256px;
	}
	.pane ul {
		border: solid 1px #495057;
		border-radius: 4px;
		padding: 4px;
		height: 300px;
		list-style: none;
	}
	.pane ul li {
		height: 32px;
	}
	.buttons {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 8px;
	}
	#button-move {
		width: 32px;
		height: 32px;
		margin: 16px;
	}
</style>
