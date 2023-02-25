
import { Howl } from "howler"

export type AudioData = {
	buf: AudioBuffer,
	howl: Howl,
	vol: number
}

type AudioListIface = {
	audioCont: AudioContext | null,
	locale: string,
	projName: string,
	data: { [name: string]: AudioData },
	init: (locale: string, projName: string) => void,
	load: (name: string, vol: number) => void,
	get: (name: string) => AudioData
}

export const GAudioList: AudioListIface = {
	audioCont: null,
	locale: "",
	projName: "game",
	data: {},
	init: function(locale, projName) {
		this.audioCont = new AudioContext();
		this.locale = locale;
		this.projName = projName;
	},
	load: async function(name, vol) {
		var fileName = "rom/" + this.projName + "/audio/" + name;
		var response = await window.fetch(fileName);
		var arrayBuffer = await response.arrayBuffer();
		var audioBuffer = await this.audioCont.decodeAudioData(arrayBuffer);
		this.data[name] = {
			'buf': audioBuffer,
			'howl': new Howl({
				'src': [fileName]
			}),
			'vol': vol
		};
	},
	get: function(name) {
		return this.data[name];
	}
}