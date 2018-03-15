class TerrainGenerator {

	constructor( source ) {

		function createContext( width, height ) {
			const canvas = document.createElement( "canvas" );
			canvas.width = width;
			canvas.height = height;
			return canvas.getContext( "2d" );
		}

		const context = createContext();

		base_image = new Image();
		base_image.src = "img/base.png";
		base_image.onload = function() {
			context.drawImage( base_image, 0, 0 );
		};
	}
}

export default TerrainGenerator;
