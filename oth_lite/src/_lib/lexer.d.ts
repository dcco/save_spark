
declare module "lexer" {

	export type EOFToken = {}

	export type LexPos = {
		col: number,
		line: number
	}

	export type VToken = {
		name: string,
		value: string,
		pos: LexPos
	}

	export type Token = EOFToken | VToken

	export function newLexer(): MyLexer

	export type MyLexer = {
		setInput: (string) => void
		nextToken: () => Token
		isEOF: (t: Token) => t is EOFToken
	}

}