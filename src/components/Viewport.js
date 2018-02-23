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
		>
			<canvas id='layer3D'></canvas>
			<svg id='layer2D'>
				<rect id='selectionBox' x="100" y="100" width="0" height="0" stroke="white" fill='transparent'/>
			</svg>
		</div>
	`,
	data() {
		return {
			mouse: {x:0, y:0},
			styleObject: {},
			raycaster: new Three.Raycaster(),
			mouse: new Three.Vector2(),
			dragStart: new Three.Vector2(),
			lastTime: 0
		};
	},
	mounted() {
		if ( !this.camera || !this.cameraRig ) {
			console.warn( "No camera attached to viewport, constructing a new rig." );
			const camera = new Three.PerspectiveCamera( 45, this.aspect, 1, 10000 );
			const d = 32;
			camera.position.set( 0, -1 * d, d );
			camera.up.set( 0, 0, 1 );
			camera.lookAt( new Three.Vector3( 0, 0, 0 ));

			const cameraRig = new Three.Object3D();
			const pivot = new Three.Object3D();

			pivot.add( camera );
			cameraRig.add( pivot );

			cameraRig.rotation.z += Math.PI/4;

			forge.getScene().add( cameraRig );

			this.$store.commit( "camera", camera );
			this.$store.commit( "cameraRig", cameraRig );
		}

		this.renderer = new Three.WebGLRenderer({
			alpha: true,
			antialias: false,
			canvas: document.getElementById( "layer3D" )
		});
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.$el.offsetWidth, this.$el.offsetHeight );

		window.addEventListener( "mouseup", this.onMouseUp.bind( this ), false );
		this.layer2D = document.getElementById( "layer2D" );
		this.lastTime;
		this.update();
	},
	computed: {
		showPrice() {
			return this.$store.state.dragging;
		},
		aspect() {
			return this.$el.offsetWidth / this.$el.offsetHeight;
		},
		cameraRig() {
			return this.$store.state.cameraRig;
		},
		camera() {
			return this.$store.state.camera;
		},
		moveLeft() {
			return this.$store.state.moveLeft;
		},
		moveRight() {
			return this.$store.state.moveRight;
		},
		moveForward() {
			return this.$store.state.moveForward;
		},
		moveBack() {
			return this.$store.state.moveBack;
		}
	},
	methods: {
		update() {
			const thisTime = performance.now();
			const delta = thisTime - this.lastTime;
			this.lastTime = thisTime;

			if ( this.moveRight ) {
				this.cameraRig.translateX( delta * 0.05 );
			}
			if ( this.moveLeft ) {
				this.cameraRig.translateX( delta * -0.05 );
			}
			if ( this.moveForward ) {
				this.cameraRig.translateY( delta * 0.05 );
			}
			if ( this.moveBack ) {
				this.cameraRig.translateY( delta * -0.05 );
			}

			this.renderer.render( forge.getScene(), this.camera );
			requestAnimationFrame( this.update );
		},
		onMouseMove( e ) {
			const scope = this;
			this.mouse.set( e.clientX, e.clientY );
			if ( this.mouseDown ) {
				/*
					Normalization of mouse coordinates is done here because the engine
					should not care (or know about) the actual viewport DOM element's
					dimensions.
				*/
				this.start = this.normalizeCenter( this.dragStart, this.renderer.domElement );
				this.end = this.normalizeCenter( this.mouse, this.renderer.domElement );

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
				/*
				this.selected.forEach(( point ) => {
					const screenPoint = scope.normalizeCorner( point, scope.$el );
					const el = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );
					el.setAttribute( "cx", screenPoint.x ); //Set path's data
					el.setAttribute( "cy", screenPoint.y ); //Set path's data
					el.setAttribute( "r", 5 ); //Set path's data
					el.style.stroke = "#000"; //Set stroke colour
					el.style.fill = "#fff"; //Set stroke colour
					scope.layer2D.appendChild( el );
				});
				*/
				this.drawSelectionBox( this.dragStart, this.mouse );

			}
		},
		onMouseDown( e ) {
			this.mouseDown = true;
			this.mouse.set( e.clientX, e.clientY );
			this.dragStart.copy( this.mouse );

			// Call the forge getWorldMousePosition() which returns the world position

			// If mouse is moving,
			forge._entityCache.recompute( this.camera );
		},
		onMouseUp( e ) {
			if ( this.mouseDown ) {
				this.mouseDown = false;
				this.drawSelectionBox( 0, 0 );
			}
		},
		normalizeCenter( p, el ) {
			return new Three.Vector2(
				( p.x / el.clientWidth ) * 2 - 1,
				( p.y / el.clientHeight ) * -2 + 1
			);
		},
		normalizeCorner( p, el ) {
			return new Three.Vector2(
				( el.clientWidth / 2 ) * p.x + el.clientWidth / 2,
				( el.clientHeight / 2 ) * -1 * p.y + el.clientHeight / 2
			);
		},
		drawSelectionBox( start, end ) {
			const box = document.getElementById( "selectionBox" );
			const max = new Three.Vector2(
				Math.max( start.x, end.x ),
				Math.max( start.y, end.y )
			);
			const min = new Three.Vector2(
				Math.min( start.x, end.x ),
				Math.min( start.y, end.y )
			);
			box.style.width = max.x - min.x;
			box.style.height = max.y - min.y;
			box.style.x = min.x;
			box.style.y = min.y;
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
