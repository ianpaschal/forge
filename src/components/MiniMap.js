import * as Three from "three";
import forge from "../forge";

export default {
	name: "MiniMap",
	components: {},
	template: `
		<canvas id='mini-map'
			v-bind:width='resolution'
			v-bind:height='resolution'
			@click='moveTo'
			v-bind:style='{
				position: "relative",
				left: ((diameter - size) / 2)+"px",
				top: ((diameter - size) / 2)+"px",
				width: size+"px",
				height: size+"px",
				transform: "rotate(45deg)"
			}'
		></canvas>
	`,
	data() {
		return {
			size: 128,
			worldSize: 512
		};
	},
	mounted() {
		this.canvas = document.getElementById( "mini-map" );
		this.ctx = this.canvas.getContext( "2d" );
		this.update();
	},
	computed: {
		player() {
			return forge.getPlayer( this.$store.state.activePlayerID );
		},
		camera() {
			return this.$store.state.camera;
		},
		cameraRig() {
			return this.$store.state.cameraRig;
		},
		resolution() {
			return this.size * window.devicePixelRatio;
		},
		diameter() {
			return this.size * Math.sqrt( 2 );
		},

		// Get the unknown map from the store:
		hidden() {
			return true;
		},

		// Get the fog of war map from the store:
		fog() {
			return true;
		}
	},
	methods: {
		update() {
			// this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			this.ctx.fillStyle = "#AD9F70";
			this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
			// Update positions of all player units and enemy units if visible;

			/*
			const entities = this.player.getEntityIDs();

			entities.forEach(( entity ) => {
				entity.getComponent()
			});
			*/

			const entities = forge.getScene().children;

			const scope = this;
			entities.forEach(( entity )=>{
				if ( entity.type === "Mesh" ) {
					const position = this.convertToScreen( entity.position );
					scope.ctx.fillStyle = "#ffff00";
					scope.ctx.fillRect(
						Math.floor( position.x ),
						Math.floor( position.y ),
						window.devicePixelRatio,
						window.devicePixelRatio
					);
				}
			});

			// Also, update the camera box;
			this.drawCameraBox( this.getCameraPoints( this.camera ));

			requestAnimationFrame( this.update );
		},
		getCameraPoints( camera ) {
			const plane = new Three.Plane( new Three.Vector3( 0, 0, 1 ), 0 );
			const screenExtents = [
				new Three.Vector2( -1, 1 ),
				new Three.Vector2( 1, 1 ),
				new Three.Vector2( 1, -1 ),
				new Three.Vector2( -1, -1 )
			];
			const worldExtents = [];
			screenExtents.forEach(( corner ) => {
				// Make a new ray and set to camera corner:
				const ray = new Three.Ray();
				ray.origin.setFromMatrixPosition( camera.matrixWorld );
				ray.direction.set( corner.x, corner.y, 1 ).unproject( camera ).sub( ray.origin ).normalize();
				worldExtents.push( ray.intersectPlane( plane ));
			});
			// console.log( worldExtents );
			return worldExtents;
		},
		drawCameraBox( worldPoints ) {
			const scope = this;
			const screenPoints = worldPoints.map( function( point ) {
				return scope.convertToScreen( point );
			});
			this.ctx.beginPath();
			this.ctx.moveTo( screenPoints[0].x, screenPoints[0].y );
			this.ctx.lineTo( screenPoints[1].x, screenPoints[1].y );
			this.ctx.lineTo( screenPoints[2].x, screenPoints[2].y );
			this.ctx.lineTo( screenPoints[3].x, screenPoints[3].y );
			this.ctx.lineTo( screenPoints[0].x, screenPoints[0].y );
			this.ctx.strokeStyle="#FFFFFF";
			this.ctx.stroke();
		},

		convertToScreen( vector ) {
			const scale = this.resolution / this.worldSize;
			const offset = this.resolution / 2;
			return new Three.Vector2(
				vector.x * scale + offset,
				vector.y * scale * -1 + offset
			);
		},
		convertToWorld( vector ) {
			const scale = this.worldSize / this.size;
			const offset = this.size / 2;
			return new Three.Vector3(
				( vector.x - offset ) * scale,
				( vector.y - offset ) * -1 * scale,
				0
			);
		},
		moveTo( e ) {
			const position = new Three.Vector2( e.offsetX, e.offsetY );
			this.cameraRig.position.copy( this.convertToWorld( position ));
		}
	}
};
