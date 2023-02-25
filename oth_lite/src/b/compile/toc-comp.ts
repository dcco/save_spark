
import { Settings } from "z/main/screen"
import { loadJsonFile, loadOthFile } from "z/parse/fetch" 
import { compBody } from "b/compile/compile"

async function loadModule(settings: Settings, lName: string, modData: any): Promise<string>
{
	var mName = modData.name;
	var fileList = modData.fileList;

	var modCode = "";
	if (modData.debug === true) { console.log("compiling module " + lName + "." + mName); }
	for (let f of fileList) {
		if (modData.debug === true) {
			console.log("> compiling: " + f + ".oth");
		}
		var fileBlock = await loadOthFile(settings.locale + "rom", settings.projName + "/src/" + lName + "/" + mName, f + '.oth');
		var fileCode = compBody(fileBlock);
		modCode = modCode + fileCode + "\n\n";
	}
	if (modData.debug === true) {
		console.log(modCode);
	}
	return modCode;
}

async function loadLibrary(settings: Settings, libData: any): Promise<string>
{
	var lName = libData.name;
	var modList = libData.modList;

	var libCode = "";
	for (let m of modList) {
		libCode = libCode + await loadModule(settings, lName, m) + "\n\n\n";
	}

	return libCode;
}

export async function compToc(settings: Settings): Promise<string>
{
	var tocData = await loadJsonFile(settings.projName, 'toc.json');
	
	var allCode = "";
	for (let l of tocData) {
		allCode = allCode + await loadLibrary(settings, l);
	}
	return allCode;
}