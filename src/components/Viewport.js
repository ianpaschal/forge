import * as Three from "three";
import forge from "../forge";
import OrbitControlModule from "three-orbit-controls";

const OrbitControls = OrbitControlModule( Three );

export default {
	name: "Viewport",
	components: {},
	template: `
		<div id='viewport'
			@mousemove='onMouseMove'
			@mousedown='onMouseDown'
		></div>
	`,
	data() {
		return {
			mouse: {x:0, y:0},
			styleObject: {},
			raycaster: new Three.Raycaster(),
			mouse: new Three.Vector2(),
			dragStart: new Three.Vector2()
		};
	},
	mounted() {
		this.camera = new Three.PerspectiveCamera( 45, this.aspect, 1, 10000 );
		this.camera.position.set( 16, -16, 16 );
		this.camera.up.set( 0, 0, 1 );
		this.camera.lookAt( new Three.Vector3( 0, 0, 0 ));

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
		this.controls.noRotate = true;

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
		},
		onMouseMove( e ) {
			this.mouse.set( e.clientX, e.clientY );
			if ( this.mouseDown ) {
				/*
					Normalization of mouse coordinates is done here because the engine
					should not care (or know about) the actual viewport DOM element's
					dimensions.
				*/
				this.start = this.cameraNormalize( this.dragStart, this.renderer.domElement );
				this.end = this.cameraNormalize( this.mouse, this.renderer.domElement );

				// Get the min and max x and y from current mouse and start mouse
				const max = new Three.Vector2(
					Math.max( this.end.x, this.start.x ),
					Math.max( this.end.y, this.start.y )
				);
				const min = new Three.Vector2(
					Math.min( this.end.x, this.start.x ),
					Math.min( this.end.y, this.start.y )
				);
				// Get a list of entity IDs which are intersected
				this.selected = forge.getSelection( max, min, this.camera );
				// Draw the selection rectangle
			}
		},
		onMouseDown( e ) {
			this.mouseDown = true;
			this.mouse.set( e.clientX, e.clientY );
			this.dragStart.copy( this.mouse );

			// Call the forge getWorldMousePosition() which returns the world position

			// If mouse is moving,
		},
		onMouseUp( e ) {
			this.mouseDown = false;
		},
		cameraNormalize( v, el ) {
			return new Three.Vector2(
				( v.x / el.clientWidth ) * 2 - 1,
				( v.y / el.clientHeight ) * -2 + 1
			);
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
