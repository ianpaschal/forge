<template>
	<div class='overlay view'>

		<div class='centered-content'>
			<div id='menu-block'>
				<div id='main-menu' class='menu-list'>
					<MenuButton
						v-for='item in menu'
						v-on:click='buttonAction(e, item.action)'
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
				{ name: "Resume Game",       action: this.close },
				{ name: "Save Game",         action: () => {
					this.$store.commit( "view", "MainMenu" );
				} },
				{ name: "Resign",            action: () => {
					this.$store.commit( "view", "MainMenu" );
				} },
				{ name: "Exit to Main Menu", action: () => {
					this.$store.commit( "view", "MainMenu" );
				} },
				{ name: "Exit to Desktop",   action: this.quit }
			]
		};
	},
	methods: {
		buttonAction( e, action ) {
			action();
		},
		close() {
			this.$emit( "unpause" );
		},
		quit() {
			const remote = require( "electron" ).remote;
			const w = remote.getCurrentWindow();
			w.close();
		}
	}
};
</script>

<style scoped>
	.overlay {
		background-color: rgba(0,0,0,0.5);
	}
</style>
