import * as Three from "three";
import forge from "../forge";

export default {
	name: "MiniMap",
	components: {},
	template: `
		<canvas width='128' height='128' id='mini-map'></canvas>
	`,
	data() {
		return {
			extent: 512 // Render extent from origin, in meters
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
		}
	},
	methods: {
		update() {
			this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			this.ctx.fillStyle = "#d8f5a2";
			this.ctx.fillRect( 0, 0, 128, 128 );
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
					scope.ctx.fillStyle = "#000000";
					scope.ctx.fillRect(
						Math.floor( entity.position.x ),
						-1 * Math.floor( entity.position.y ),
						2,
						2
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
			screenExtents.forEach(( point ) => {
				// Make a new ray and set to camera corner:
				const ray = new Three.Ray();
				ray.origin.setFromMatrixPosition( camera.matrixWorld );
				ray.direction.set( point.x, point.y, 0.5 ).unproject( camera ).sub( ray.origin ).normalize();
				worldExtents.push( ray.intersectPlane( plane ));
			});
			return worldExtents;
		},
		drawCameraBox( points ) {
			this.ctx.beginPath();
			this.ctx.moveTo( points[0].x + 64, -1 * points[0].y + 64 );
			this.ctx.lineTo( points[1].x + 64, -1 * points[1].y + 64 );
			this.ctx.lineTo( points[2].x + 64, -1 * points[2].y + 64 );
			this.ctx.lineTo( points[3].x + 64, -1 * points[3].y + 64 );
			this.ctx.lineTo( points[0].x + 64, -1 * points[0].y + 64 );
			this.ctx.stroke();
		}
	}
};
