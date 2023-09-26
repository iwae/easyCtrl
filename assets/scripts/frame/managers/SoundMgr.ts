
import { AudioSourceComponent, _decorator } from "cc";
import RES from "./ResMgr";


class SoundMgr {
  
    /**
     * @en : for bgm
     * @cn : bgm
     */
    private _audioComp: AudioSourceComponent = new AudioSourceComponent();;
 
    /**
     * @en : for loop audio effect
     * @cn : 循环音效
     */
    private _audioLoopComp: AudioSourceComponent = new AudioSourceComponent();;
    /**
     * @en : for one-time audio effect
     * @cn : 单次音效
     */
    private _effectComp: AudioSourceComponent = new AudioSourceComponent();;
    private _curLoopAudioName: string = "";
   

    /**
     * @en : play bgm
     * @cn : 播放背景音乐
     * @param {string} audio
     * @param {boolean} isLoop
     */
    public startBgm (audio?: string, isLoop: boolean = true) {
        if (!audio && this._audioComp.clip) {
            this._audioComp.play();
            return;
        }
        if (!audio) return;
        let clip = RES.getClip(audio);
        this._audioComp.clip = clip;
        this._audioComp.loop = isLoop;
        this._audioComp.volume = 0.5;
        this._audioComp.play();
    }

    /**
     * @en : stop bgm
     * @cn : 停止背景音乐
     */
    public stopBgm() {
        this._audioComp.stop();
    }

    /**
     * @en : play audio clip in one time, for effect usage
     * @cn : 播放一次音效
     * @param {string} clip
     * @param {*} scale
     */
    public play(clip: string, scale = 0.6) {
        this._effectComp.playOneShot(RES.getClip(clip), scale);
    }
    /**
     * @description: Play loop Audio
     * @param {string} audio
     * @return {*}
     */
    public loop(audio: string) {

        let clip = RES.getClip(audio);
        this._audioLoopComp.stop();
        this._audioLoopComp.clip = clip;
        this._audioLoopComp.loop = true;
        this._audioLoopComp.play();
        this._curLoopAudioName = audio;
    }

    public stoploop() {
        this._audioLoopComp.stop();
    }

}

const SOUND = new SoundMgr;

export default SOUND;