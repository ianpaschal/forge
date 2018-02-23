// Load all the validators

// ...

const validators = {

};

export default function( input, check ) {
	if ( !validators.check ) {
		return console.error( "Could not check "+input+"; No \""+check+"\" validator found." );
	}
	return validators.check( input );
}
