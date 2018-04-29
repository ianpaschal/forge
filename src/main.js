import { app, BrowserWindow, ipcMain } from "electron";
import Path from "path";
import URL from "url";
import io from "socket.io-client";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const windows = {};

function createPlayWindow() {

	// Create the browser window.
	windows.play = new BrowserWindow({
		minHeight: 600,
		minWidth: 800,
		width: 800,
		height: 600,
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

// Networking
let socket;

const id = "B54A95127A4B573F41E335FDBD339DCC2208FBFB1AE0B6FAB7599D6E2D6EC754";

ipcMain.on( "connect", ( event, data ) => {
	const url = "http://" + data + ":5000";
	socket = io.connect( url );

	socket.on( "connect", () => {
		console.log( "Connected to the server at ", url );
		socket.emit( "register", id );
		windows.play.webContents.send( "connectSuccess" );
	});

	socket.on( "loadStack", ( stack ) => {
		console.log( "GOT STACK", stack );
		windows.play.webContents.send( "loadStack", stack );
	});
});
ipcMain.on( "ready", () => {
	socket.on( "state", ( data ) => {
		console.log( data );
	});
});
ipcMain.on( "closeSocket", () => {
	socket.close();
});

/*
// Send simulation updates:
setInterval( () => {
	socket.emit( "message", "world" );
}, 2000 );
*/
