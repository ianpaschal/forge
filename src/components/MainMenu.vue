<!-- Forge source code is distributed under the MIT license. -->

<template>
	<div>
		<div class='centered-content'>
			<div id='title-block'>
				<h1>FORGE</h1>
				<h2>A really great game, dude.</h2>
			</div>
			<div id='menu-block'>
				<div id='main-menu' class='menu-list'>
					<MenuButton
						class='menu-button'
						v-for='item in mainMenu'
						v-bind:label='item.name'
						v-on:click='buttonAction( item.action)'
					/>
				</div>
				<div id='single-player-menu' class='menu-list' v-show='subMenuOpen'>
					<MenuButton
						v-for='item in subMenuItems'
						transition='fade'
						stagger='100'
						v-bind:label='item.name'
						v-bind:key='item.name'
						v-on:click='buttonAction( item.action)'
					/>
				</div>
			</div>
		</div>
		<Modal v-if='showModal' v-bind:message='modalMessage' v-bind:options='modalOptions'/>
	</div>
</template>

<script>
import MenuButton from "./MenuButton.vue";
import Modal from "./Modal.vue";
import engine from "../engine";
export default {
	name: "MainMenu",
	components: {
		MenuButton,
		Modal
	},
	data() {
		return {

			subMenuOpen: false,
			subMenuItems: [],
			showModal: false,

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
				{ name: "Quit Game",     action: () => {
					this.showModal = true;
				} },
			],
			singlePlayerMenu: [
				{ name: "Resume Game",   action: this.createGame },
				{ name: "New Game",      action: this.createGame },
				{ name: "Load Game",     action: this.createGame }
			],
			multiPlayerMenu: [
				{ name: "LAN",           action: this.createGame },
				{ name: "Internet",      action: () => {
					this.$store.commit( "view", "NetworkConnect" );
				} }
			],
			modalMessage: "Are you sure you want to quit?",
			modalOptions: [
				{ name: "Cancel",       action: () => {
					this.showModal = false;
				} },
				{ name: "Quit",         action: this.quit }
			]
		};
	},
	methods: {
		buttonAction( action ) {
			action();
		},
		openSubMenu( menu ) {
			if ( menu !== this.subMenuOpen ) {
				this.subMenuOpen = menu;
				this.subMenuItems = this[ menu ];
			}
			else {
				this.subMenuOpen = false;
				this.subMenuItems = [];
			}
		},

		createGame() {
			this.$store.commit( "view", "Loading" );
			engine.init(
				this.$store.state.pluginStack,
				false,
				( progress ) => {
					this.$store.commit( "loaded", progress );
					console.log( "Loading...", progress );
				},
				() => {
					this.$store.commit( "player", engine.getPlayer( 0 ) );
					this.$store.commit( "view", "Play" );
					engine.start();
				}
			);
		},
		quit() {
			const remote = require( "electron" ).remote;
			const w = remote.getCurrentWindow();
			w.close();
		}
	}
};
</script>

<style>
	#title-block {
		text-align: center;
		height: 128px;
		padding: 24px;
		box-sizing: border-box;
		width: 512px;
	}
	#menu-block {
		height: 50%;
		display: flex;
		align-items: center;
	}
	.menu-list {
		width: 256px;
		margin: 0 auto;
		backface-visibility: hidden;
		padding: 8px;
		box-sizing: border-box;
		border-left: solid 2px grey;
	}
</style>
