import forge from "../forge";
import * as Three from "three";
export default {
	name: "Nimbus",
	template: `
		<div class='nimbus' :style='style'>
			<div class='fill' :style='fillStyle'></div>
		</div>
	`,
	props: ["entity"],
	computed: {
		camera() {
			return this.$store.state.camera;
		},
		style() {
			// console.log( this.position );
			return {
				top: (( this.position ? this.position.y : 0 ) - 2 ) + "px",
				left: (( this.position ? this.position.x : 0 ) - 40 ) + "px"
			};
		},
		fillStyle() {
			const percent = ( this.entity.components.resource.wood / 150 ) * 100;
			let background;
			if ( percent <= 20 ) {
				background = "#e03131";
			} else if ( percent <= 50 ) {
				background = "#ffd43b";
			} else {
				background = "#94d82d";
			}
			return {
				width: percent + "%",
				background: background
			};
		},
		parentWidth() {
			return this.$parent.$el.clientWidth;
		},
		parentHeight() {
			return this.$parent.$el.clientHeight;
		}
	},
	methods: {
		update() {
			const projected = new Three.Vector3();
			projected.copy( this.entity.components.position );
			projected.z += 9.5;
			projected.project( this.camera );
			this.position.set(
				( this.parentWidth / 2 ) * projected.x + this.parentWidth / 2,
				( this.parentHeight / 2 ) * -1 * projected.y + this.parentHeight / 2
			);
			requestAnimationFrame( this.update );
		}
	},
	mounted() {
		this.update();
	},
	data() {
		return {
			position: new Three.Vector2()
		};
	}
};
