define(["require", "exports", "z/sys/audio/audio-list"], function (require, exports, audio_list_1) {
    "use strict";
    exports.__esModule = true;
    exports.GAudio = void 0;
    exports.GAudio = {
        curTrack: null,
        curHowl: null,
        nextTrack: null,
        volume: 0,
        tarVol: 0,
        extVol: 75,
        playSound: function (name) {
            var track = audio_list_1.GAudioList.get(name);
            if (track === undefined)
                return;
            var howl = track.howl;
            howl.seek(0);
            howl.play();
            howl.volume(track.vol * this.extVol / 100);
            howl.loop(false);
        },
        playMusic: function (name) {
            this.nextTrack = name;
            /*var track = GAudioList.get(name);
            if (track === undefined) return;
            var howl = track.howl;
            howl.seek(0);
            howl.play();*/
        },
        stopMusic: function () {
            this.nextTrack = null;
        },
        incVol: function (n) {
            this.extVol = this.extVol + n;
            if (this.extVol < 0) {
                this.extVol = 0;
            }
            else if (this.extVol > 100) {
                this.extVol = 100;
            }
        },
        update: function () {
            var vp = this.extVol / 100;
            if (this.curHowl !== null) {
                this.curHowl.volume(this.volume * vp);
            }
            // if new track is set to play
            if (this.curTrack !== this.nextTrack) {
                // if fade out is finished, begin next track.
                if (this.volume === 0) {
                    // if next track is null, stop playback
                    if (this.nextTrack === null) {
                        this.curTrack = this.nextTrack;
                        if (this.curHowl !== null) {
                            this.curHowl.stop();
                        }
                        this.curHowl = null;
                        // otherwise, begin playback
                    }
                    else {
                        // if track is not loaded, wait
                        var track = audio_list_1.GAudioList.get(this.nextTrack);
                        if (track === undefined)
                            return;
                        this.curHowl = track.howl;
                        this.curHowl.seek(0);
                        this.curHowl.play();
                        this.curHowl.loop(true);
                        this.tarVol = track.vol;
                        if (this.curTrack === null) {
                            this.curHowl.volume(track.vol * vp);
                        }
                        else {
                            this.curHowl.volume(0);
                        }
                        this.curTrack = this.nextTrack;
                    }
                }
                // otherwise, lower volume
                if (this.curHowl === null)
                    return;
                if (this.volume > 0)
                    this.volume = this.volume - 0.1;
                if (this.volume < 0)
                    this.volume = 0;
                // otherwise, begin fading in new track
            }
            else if (this.curTrack !== null) {
                if (this.curHowl === null || this.volume === this.tarVol)
                    return;
                if (!this.curHowl.playing()) {
                    this.curHowl.play();
                }
                if (this.volume < this.tarVol)
                    this.volume = this.volume + (0.1 * this.tarVol);
                if (this.volume > this.tarVol)
                    this.volume = this.tarVol;
            }
        }
    };
});
