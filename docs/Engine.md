On load, start off by registering all assets.

Registration list:

- Models
- Sounds
- Textures

Next, register all components:

Next, register all assemblies:

Next, register all systems:



Now, scan the user folder for folders. Each folder must have a package.json file
or its not a valid module.

if type is png, its treated as a Textures
if type is ogg, it is considered a sound

manifest tells which file within the package replaces.



For example.

I want to add a new unit. this unit has an assembly file which specifies which components it uses

this might include a new custom component


so you can add new assets such as

a new assembly (ie a new entity type)
	stack: null

	By default, stack is null which means it does not overwite any existing entity, and instead creates a new stack.



{
	name: "My great mod",
	version: "0.1.0",
	author: "Ian",
	contents: [
		{ type: "model", stack: null, path: "./models/monster.json" },
		{ type: "sound", stack: null, path: "./sounds/growl.ogg" },
		{ type: "assembly", stack: null, path: "./assemblies/big_monster.json" },
		{ stack: null, path: "./models/monster.json" },
		{ stack: null, path: "./models/monster.json" },
	]
}



so the manifest lists all files in the package and specifies their type and what they overwrite

	each item in the manifest must have:

	id: "some name of a thing"
	type: "what it is"
	path: "./some-file-in-the-package.wat"



overwrite order is determined by plugin manager

files with 
