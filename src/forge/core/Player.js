import * as Three from "three";
export default class {
	constructor() {
		this._cameraDistance = 32;
		this._horizontalPivot = new Three.Object3D();
		this._verticalPivot = new Three.Object3D();
		this._cameraNode = new Three.Object3D();

		this._cameraNode.position.y = -1 * this._cameraDistance;
		this._horizontalPivot.add( this._verticalPivot );
	}
}
