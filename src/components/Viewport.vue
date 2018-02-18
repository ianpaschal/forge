<template>
	<div id='viewport'>
		<!-- <p v-if='debug'>
			{{ fps }}
		</p> -->
	</div>
</template>

<script>
	import * as Three from "three";
	import forge from "../forge";
	import OrbitControlModule from "three-orbit-controls";

	const OrbitControls = OrbitControlModule( Three );

	export default {
		name: "Viewport",
		components: {},
		data() {
			return {
				styleObject: {},
				raycaster: new Three.Raycaster(),
				mouse: {
					world: new Three.Vector3(),
					screen: new Three.Vector2()
				}
			};
		},
		mounted() {
			this.camera = new Three.PerspectiveCamera( 45, this.aspect, 1, 10000 );
			this.camera.position.set( 16, -16, 16 );
			this.camera.up.set( 0, 0, 1 );
			this.camera.lookAt( new Three.Vector3( 0, 0, 0 ) );

			// Action!
			this.renderer = new Three.WebGLRenderer({
				alpha: true,
				antialias: false
			});
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( this.$el.offsetWidth, this.$el.offsetHeight );
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.renderReverseSided = false;

			this.$el.appendChild( this.renderer.domElement );

			this.controls = new OrbitControls( this.camera, this.$el );
			this.controls.enabled = true;

			this.loop();
		},
		computed: {
			showPrice() {
				return this.$store.state.dragging;
			},
			aspect() {
				return this.$el.offsetWidth / this.$el.offsetHeight;
			}
		},
		methods: {
			loop() {
				this.renderer.render( forge.getScene(), this.camera );
				requestAnimationFrame( this.loop );
			}
		}
	};
	/*
	_resize( e ) {
		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize( window.innerWidth, window.innerHeight );
	}
	*/
</script>

<style>
	#viewport {
		width: 100%;
		height: 100%;
		position: absolute;
	}
	canvas {
		width: 100%;
		height: 100%;
	}
</style>