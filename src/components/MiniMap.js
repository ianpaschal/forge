import * as Three from "three";
import forge from "../forge";

export default {
	name: "MiniMap",
	components: {},
	template: `
		<canvas id='mini-map'
			v-bind:width='screenSize'
			v-bind:height='screenSize'
			@click='moveTo'
		></canvas>
	`,
	data() {
		return {
			pixelRatio: 2, // 2 for high DPI
			screenSize: 128, // Render extent from origin, in meters
			worldSize: 512
		};
	},
	mounted() {
		this.canvas = document.getElementById( "mini-map" );
		this.ctx = this.canvas.getContext( "2d" );
		this.update();
	},
	computed: {
		activePlayerID() {
			return this.$store.state.activePlayerID;
		},
		player() {
			return this.$store.state.player;
		},
		camera() {
			return this.$store.state.camera;
		},
		cameraRig() {
			return this.$store.state.cameraRig;
		},
		scale() {
			return this.screenSize / this.worldSize;
		}
	},
	methods: {
		update() {
			// this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			this.ctx.fillStyle = "#AD9F70";
			this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );

			// Update positions of all player units and enemy units if visible
			const entityIDs = this.player.getEntityIDs();
			entityIDs.forEach(( uuid ) => {
				const pos = this.convertWorldToSpace( forge.getEntity( uuid ).components.position );
				this.ctx.fillStyle = "#"+this.player.color.getHexString();
				this.ctx.fillRect( Math.floor( pos.x ), Math.floor( pos.y ), 1, 1 );
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
			this.ctx.moveTo( points[0].x * this.scale + 64, -1 * points[0].y * this.scale + 64 );
			this.ctx.lineTo( points[1].x * this.scale + 64, -1 * points[1].y * this.scale + 64 );
			this.ctx.lineTo( points[2].x * this.scale + 64, -1 * points[2].y * this.scale + 64 );
			this.ctx.lineTo( points[3].x * this.scale + 64, -1 * points[3].y * this.scale + 64 );
			this.ctx.lineTo( points[0].x * this.scale + 64, -1 * points[0].y * this.scale + 64 );
			this.ctx.strokeStyle="#FFFFFF";
			this.ctx.stroke();
		},
		convertWorldToSpace( vec ) {
			const offset = this.screenSize / 2;
			return {
				x: vec.x * this.scale + offset,
				y: vec.y * this.scale * -1 + offset
			};
		},
		convertScreen( vec ) {
			// 0 -> 128 => -512 -> +512
			const offset = this.screenSize / 2;
			const scale = this.worldSize / this.screenSize;
			vec.x -= offset;
			vec.y -= offset;
			return {
				x: vec.x * scale,
				y: vec.y * scale * -1
			};
		},
		moveTo( e ) {

			const position = this.convertScreen({ x: e.offsetX, y: e.offsetY });
			this.cameraRig.position.x = position.x;
			this.cameraRig.position.y = position.y;
		}
	}
};
