const Three = require( "three" );
const store = require( "../ui/store" );
export default class {

	constructor( name ) {

		this.name = name || "Unamed World";

		const mesh = new Three.Mesh( new Three.PlaneGeometry( 1024, 1024 ), new Three.MeshLambertMaterial({
			color: 0x999999
		}) );

		store.state.scene.add( mesh );
	}

	registerEntity() {

	}

	deregisterEntity() {

	}

}
