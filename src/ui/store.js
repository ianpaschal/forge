const Vue = require( "vue/dist/vue.common.js" );
const Vuex = require( "vuex" );
const Three = require( "three" );

Vue.use( Vuex );
module.exports = new Vuex.Store({
	state: {
		scene: new Three.Scene()
	},
	getters: {},
	mutations: {},
	actions: {}
});
