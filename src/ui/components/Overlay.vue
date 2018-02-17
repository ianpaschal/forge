<template>
	<div id='overlay'>

		<div class='centered-content'>
			<div id='menu-block'>
				<div id='main-menu' class='menu-list'>
					<MenuButton
						v-for='item in menu'
						v-bind:label='item.name'
					/>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import MenuButton from "./MenuButton.vue";
	export default {
		name: "Play",
		components: {
			MenuButton
		},
		data() {
			return {
				paused: false,
				menu: [
					{ name: "Resume Game", action: null },
					{ name: "Save Game", action: ()=>{this.$emit("switchView", "MainMenu")} },
					{ name: "Resign", action: ()=>{this.$emit("switchView", "MainMenu")} },
					{ name: "Exit to Main Menu", action: ()=>{this.$emit("switchView", "MainMenu")} },
					{ name: "Exit to Desktop", action: this.quit }
				]
			};
		},
		methods: {
			buttonAction( e, action ) {
				const sfx = new Audio('../ui/sounds/menu-select.wav');
				sfx.play();
				action();
			},
			quit() {
				const remote = require('electron').remote;
				let w = remote.getCurrentWindow();
				w.close();
			}
		}
	};
</script>

<style>
	#overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#menu-block {
		height: 50%;
		background-color: pink;
		display: flex;
		align-items: center;
	}
	.menu-list {
		width: 256px;
		background-color: blue;
		margin: 0 auto;
		backface-visibility: hidden;
		padding-left: 8px;
		box-sizing: border-box;
	}
</style>
