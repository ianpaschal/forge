<template>
	<div id='plugins'>
		<div class='centered'>
			<div class='title'>Connect</div>
			<form v-on:submit.prevent="connect">
				<input autofocus v-model='address' placeholder='IP address'>
				<div class='buttons'>
					<StandardButton v-bind:label='"Connect"'/>
					<StandardButton v-bind:label='"Cancel"' @click='()=>{
						$store.commit("view", "MainMenu");
						ipcRenderer.send("closeSocket");
						}'/>
				</div>
			</form>
		</div>
		<Modal v-if='modalVisible' v-bind:message='modalMessage' v-bind:options='modalOptions'/>
	</div>
</template>

<script>
import { ipcRenderer } from "electron";
import engine from "../engine";
import Modal from "./Modal.vue";
import StandardButton from "./buttons/StandardButton.vue";
export default {
	name: "NetworkConnect",
	components: {
		Modal,
		StandardButton
	},
	data() {
		return {
			address: "",
			modalVisible: false,
			modalMessage: "",
			modalOptions: [
				{ name: "Manage", action: () => {
					this.$store.commit( "view", "Plugins" );
				} },
				{ name: "OK", action:() => {
					this.$store.commit( "view", "MainMenu" );
				} }
			]
		};
	},
	methods: {
		connect() {
			console.log( this.address );
			ipcRenderer.send( "connect", this.address );
		},
		joinNetworkGame() {
			const loadStack = engine.findPlugins();
			console.log( "OKAY GOING TO TRY AND LOAD" );
			this.$store.commit( "view", "Loading" );
			engine.loadAssets(
				loadStack,
				( name ) => {
					console.log( "Loaded " + name + "." );
				},
				() => {
					ipcRenderer.send( "ready" );
					this.$store.commit( "view", "Play" );
				}
			);
		},
	},
	mounted() {
		ipcRenderer.on( "connectSuccess", () => {
			console.log( "WE DID IT!" );
			// TODO: Send plugin stack
		});
		ipcRenderer.on( "connectFailure", () => {
			console.log( "WE FAILED!" );
			ipcRenderer.send( "closeSocket" );
		});
		ipcRenderer.on( "loadStack", ( event, remoteStack ) => {
			engine.setPluginStack( this.$store.state.pluginStack );
			const loadStack = engine.findPlugins();

			try {
				remoteStack.forEach( ( remoteAsset ) => {
					const exists = loadStack.find( ( localAsset ) => {
						return remoteAsset.name === localAsset.name;
					});
					if ( !exists ) {
						const m = "Missing " + remoteAsset.type + " " + remoteAsset.name;
						throw "Could not connect to server: " + m + ".";
					}
				});
			}
			catch ( error ) {
				console.error( error );
				this.modalMessage = error;
				this.modalVisible = true;
				ipcRenderer.send( "closeSocket" );
			}
			this.joinNetworkGame();
		});
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
