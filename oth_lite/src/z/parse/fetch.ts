
import { VToken, newLexer } from "lexer"
import { Stmt, parseBlock } from "z/parse/parser"

export var IGNORE_DIR = true

export async function loadJsonFile(pName: string, path: string): Promise<any>
{
	var file = await fetch("rom/" + pName + "/" + path, {
		mode: 'cors',
		headers: { 'Access-Control-Allow-Origin':'*' }
	});
	return await file.json();
}

export async function loadOthFile(dirName: string, pName: string, path: string): Promise<Stmt[]>
{
	// load file + lexer
	var fetchName = "/" + dirName + "/" + pName + "/" + path;
	if (IGNORE_DIR) { fetchName = dirName + "/" + pName + "/" + path; }
	var file = await fetch(fetchName, {
		mode: 'cors',
		headers: { 'Access-Control-Allow-Origin':'*' }
	});
	var fileText = await file.text();
	var lexer = newLexer();
	lexer.setInput(fileText);

	// run lexer to get token list
	var tokenList: VToken[] = [];
	var curToken = lexer.nextToken();
	while (!lexer.isEOF(curToken)) {
		tokenList.push(curToken);
		curToken = lexer.nextToken();
	}

	// parse the token list
	return parseBlock(tokenList);
}