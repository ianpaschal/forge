import * as Three from "three";
const OrbitControls = require( "three-orbit-controls" )( Three );
const store = require( "../ui/store" );

export default class {
	constructor() {
		console.log( "Created a new rendering system." );
		this._mixers = [];
		this._savedTime = 0;
		this._maxFPS = 60;

		const loader = new Three.JSONLoader();

		const scope = this;

		const paths = [];
		paths.push( "../../plugins/age-of-mythology/model/greek-villager-female-forage.js" );
		paths.push( "../../plugins/age-of-mythology/model/greek-villager-female-walk.js" );
		paths.push( "../../plugins/age-of-mythology/model/greek-villager-female-idle.js" );
		paths.forEach( ( path ) => {
			loader.load( path, ( geometry, materials ) => {
				for ( var i = 0; i < materials.length; i++ ) {
					materials[ i ].color.setRGB( 1.0, 1.0, 1.0 );
					materials[ i ].morphTargets = true;
				}
				const mesh = new Three.Mesh( geometry, new Three.MeshLambertMaterial({
					color: 0x999999
				}) );
				mesh.material.morphTargets = true;

				const mixer = new Three.AnimationMixer( mesh );
				const clip = Three.AnimationClip.CreateFromMorphTargetSequence( "walk", geometry.morphTargets, 30 );
				const action = mixer.clipAction( clip );
				action.setDuration( 2 );
				action.play();

				store.state.scene.add( mesh );
				mesh.position.x = paths.indexOf( path ) * 2;
				scope._mixers.push( mixer );
			});
		});

		// store.state.scene = new Three.Scene();
		/*
		this._renderer = new Three.WebGLRenderer();
		this._renderer.setClearColor( 0x999999 );
		this._renderer.setPixelRatio( window.devicePixelRatio );
		this._renderer.setSize( window.innerWidth, window.innerHeight );
		this._renderer.antialias = false;

		container.appendChild( this._renderer.domElement );
		window.addEventListener( "resize", this._resize.bind( this ), false );

		this._controls = new OrbitControls( this._camera, this._renderer.domElement );
		this._controls.enableRotate = true;
		*/
	}
	update( delta ) {
		this._savedTime += delta;
		if ( this._savedTime > 1000 / this._maxFPS ) {
			// this._systems.rendering.update( delta );
			// Remove simulated time:
			this._savedTime -= delta;
		}

		this._mixers.forEach( ( mixer ) => {
			mixer.update( delta / 1000 );
		});

		// this._renderer.render( this._scene, this._camera );
	}
	/*
	_resize( e ) {
		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._renderer.setSize( window.innerWidth, window.innerHeight );
	}
	*/
}

/*
FPS STUFF:
// Reset FPS counter:
FORGE.fpsDisplay.innerHTML = Math.round( FORGE.framesThisSecond ) + " FPS";
FORGE.framesThisSecond = 0;

// console.log("Fixed update (saved time was " + FORGE._savedFixedTime + ")!");
// CORE FORGE SYSTEMS WHICH ARE ALWAYS UPDATED:
FORGE.Terrain.mirror();

// Update our FPS counter:
FORGE.framesThisSecond++;
*/
