const { app, BrowserWindow, ipcMain } = require( "electron" );
const Path = require( "path" );
const URL = require( "url" );
const { Fork } = require( "child_process" );

const Three = require( "three" );

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const windows = {};

function createPlayWindow() {

	console.log( app.getPath( "userData" ) );

	// Create the browser window.
	windows.play = new BrowserWindow({
		minHeight: 600,
		minWidth: 800,
		width: 1024,
		height: 768,
		center: true,
		resizable: true,
		frame: true,
		transparent: false
	});
	windows.play.setMenu( null );

	// and load the index.html of the app.
	windows.play.loadURL( URL.format({
		pathname: Path.join( app.getAppPath(), "src/windows/play.html" ),
		protocol: "file:",
		slashes: true
	}) );

	// Open the DevTools.
	// windows.play.webContents.openDevTools();

	// Emitted when the window is closed:
	windows.play.on( "closed", () => {
		delete windows.play;
	});
}

// Create window when app is ready:
app.on( "ready", () => {
	createPlayWindow();
});

// Quit when all windows are closed:
app.on( "window-all-closed", () => {
	app.quit();
});

// Re-create window if somehow it went missing:
app.on( "activate", () => {
	if ( windows.play === null ) {
		createPlayWindow();
	}
});

// Send simulation updates:
const loopTimer = setInterval( () => {
	windows.play.webContents.send( "info", {
		msg: "Simulation update from main process."
	});
}, 2000 );
