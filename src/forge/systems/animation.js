import * as Three from "three";
import capitalize from "../utils/capitalize";

/**
	* description of UI.
	* @memberof namespace:Engine
	* ^^^^^^^^^ need to tell JSDoc UI is a member
	* @class
	*/
class AnimationSystem {

	constructor() {
		this.name = "rendering";
		this._mixers = [];
		this.walking = undefined;
		this._savedTime = 0;
		this._maxFPS = 60;
		console.log( "Created a new " + this.name + " system." );
		return this;
	}

	init( engine ) {
		if( !engine ) {
			console.warn( capitalize( this.name ) + ": Attempted to initalize system without an engine!" );
			return;
		}
		console.log( capitalize( this.name ) + ": Linked system to engine." );
		
		const loader = new Three.JSONLoader();
		// console.log( "IN ANIMATION:", forge );
		const scope = this;

		const paths = [];
		// paths.push( "../../plugins/age-of-mythology/model/greek-villager-female.js" );
		/*
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

				const clips = Three.AnimationClip.CreateClipsFromMorphTargetSequences( geometry.morphTargets, 30 );
				// const forageClip = Three.AnimationClip.CreateFromMorphTargetSequence( "forage", geometry.morphTargets, 30 );

				console.log( clips );
				const mixer = new Three.AnimationMixer( mesh );
				const walkAction = mixer.clipAction( clips[ 0 ] );
				const forageAction = mixer.clipAction( clips[ 1 ] );

				walkAction.setDuration( 2 );
				walkAction.play();
				// forageAction.play();

				// forge.getScene().add( mesh );
				mesh.position.x = paths.indexOf( path ) * 2;
				scope._mixers.push( mixer );
				if ( paths.indexOf( path ) === 1 ) {
					scope.walking = mesh;
				}
			});
		});
		*/
	}

	/**
		* Updates the system with a certain amount of ellapsed time.
		* @param {number} delta - Time in milliseconds to update the system.
		*/
	update( delta ) {
		this._savedTime += delta;
		if ( this._savedTime > this._stepSize ) {
			this._savedTime -= delta;
		}
		this._mixers.forEach( ( mixer ) => {
			mixer.update( delta / 1000 );
		});
	}

}

export default AnimationSystem;
