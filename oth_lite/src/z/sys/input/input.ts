
export type InputIface = {
	revKeyList: string[],
	liveDownData: { [name: string]: boolean },
	frameDownData: { [name: string]: boolean },
	pressData: { [name: string]: boolean },
	dasData: { [name: string]: number },
	init: () => void,
	refresh: () => void,
	down: (k: string) => boolean,
	press: (k: string) => boolean,
	das: (k: string, start: number, freq: number) => boolean
}

// key names to key codes
const keyList = {
	'start': 13,
	'z': 32,
	'a': 74,
	'b': 75,
	'c': 76,
	'l': 85,
	'r': 73,
	'f': 70,
	'd-up': 38,
	'd-left': 37,
	'd-right': 39,
	'd-down': 40,
	'up': 87,
	'left': 65,
	'right': 68,
	'down': 83,
	'mode-left': 78,
	'mode-right': 77
};

export const GInput: InputIface = {
	revKeyList: [],
	liveDownData: {},
	frameDownData: {},
	pressData: {},
	dasData: {},
	init: function() {
		for (let key in keyList) {
			this.revKeyList[keyList[key]] = key;
		};
		var revKeyList = this.revKeyList;
		var liveDownData = this.liveDownData;
		document.addEventListener('keydown', function(event) {
			var kName = revKeyList[event.keyCode];
			if (kName === undefined) return;
			liveDownData[kName] = true;
		});
		document.addEventListener('keyup', function(event) {
			var kName = revKeyList[event.keyCode];
			if (kName === undefined) return;
			liveDownData[kName] = false;
		});
	},
	refresh: function() {
		for (let key in this.liveDownData) {
			var curDown = this.liveDownData[key];
			var prevDown = this.frameDownData[key];
			if (curDown) {
				if (prevDown === true) {
					this.pressData[key] = false;
					this.dasData[key] = this.dasData[key] + 1;
				} else {
					this.frameDownData[key] = true;
					this.pressData[key] = true;
					this.dasData[key] = 1;
				}
			} else {
				this.frameDownData[key] = false;
				this.pressData[key] = false;
				this.dasData[key] = 0;
			}
		}
	},
	down: function(s) {
		if (!(s in keyList)) return false;
		return this.frameDownData[s] === true;
	},
	press: function(s) {
		if (!(s in keyList)) return false;
		return this.pressData[s] === true;
	},
	das: function(s, start, f) {
		if (!(s in keyList)) return false;
		var dasCount = this.dasData[s];
		if (dasCount > start) return (dasCount - start) % f === 0;
		return this.pressData[s] === true;
	}
}