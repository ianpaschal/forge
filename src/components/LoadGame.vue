<!-- Forge source code is distributed under the MIT license. -->

<template>
	<div id='view-block' class='view frame-mid'>

		<div class='centered-content'>
			<div id='title-block'>
				<h1>FORGE</h1>
				<h2>A really great game, dude.</h2>
			</div>
			<div id='menu-block' v-bind:style='{ width: menuWidth + "px" }'>
				<div id='main-menu' class='menu-list'>
					<MenuButton
						class='menu-button'
						v-for='item in mainMenu'
						v-bind:label='item.name'
						v-on:click='buttonAction(e, item.action)'
					/>
				</div>
				<div id='single-player-menu' class='menu-list' v-show='menuOpen'>
					<MenuButton
						v-for='item in subMenuItems'
						transition='fade'
						stagger='100'
						v-bind:label='item.name'
						v-bind:key='item.name'
						v-on:click='buttonAction(e, item.action)'
					/>
				</div>
			</div>

		</div>

	</div>
</template>

<script>
// const { dialog } = require( "electron" ).remote;
// import { remote } from "electron";
import MenuButton from "./MenuButton.vue";
export default {
	name: "MainMenu",
	components: {
		MenuButton
	},
	data() {
		return {

			menuOpen: false,
			subMenuItems: [],

			mainMenu: [
				{ name: "Single Player", action: () => {
					this.openSubMenu( "singlePlayerMenu" );
				} },
				{ name: "Multiplayer",   action: () => {
					this.openSubMenu( "multiPlayerMenu" );
				} },
				{ name: "Plugins",       action: () => {
					this.$store.commit( "view", "Plugins" );
				} },
				{ name: "Preferences",   action: () => {
					this.$store.commit( "view", "Preferences" );
				} },
				{ name: "Editor",        action: this.quit },
				{ name: "Credits",       action: () => {
					this.$store.commit( "view", "Credits" );
				} },
				{ name: "Quit Game",     action: this.quit }
			],
			singlePlayerMenu: [
				{ name: "Resume Game",   action: () => {
					this.$store.commit( "view", "Play" );
				} },
				{ name: "New Game",      action: () => {
					this.$store.commit( "view", "Play" );
				} },
				{ name: "Load Game", action: "null" }
			],
			multiPlayerMenu: [
				{ name: "LAN", action: "null" },
				{ name: "Internet", action: "null" }
			]
		};
	},
	methods: {
		buttonAction( e, action ) {
			action();
		},
		openSubMenu( menu ) {
			this.menuOpen = true;
			this.subMenuItems = this[ menu ];
		},
		quit() {
			const remote = require( "electron" ).remote;
			const w = remote.getCurrentWindow();
			w.close();
		},
		loadFile() {
			/*
				const paths = dialog.showOpenDialog({
					defaultPath: "/Users/Ian/Desktop",
					buttonLabel: "Import",
					properties: [ "openFile", "openDirectory", "multiSelections" ],
					filters: [
						{ name: "Custom File Type", extensions: [ "obj", "stl" ] }
					]
				});
				this.$store.dispatch( "loadFile", paths[ 0 ] );
			*/
		}
	}
};
</script>

<style scoped>
	#view-block {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#title-block {
		text-align: center;
		height: 128px;
		padding: 24px;
		box-sizing: border-box;
		background-color: #000;
		width: 512px;
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
