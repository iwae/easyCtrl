
import { _decorator, Component, Vec3, lerp, SkeletalAnimation, Quat, Node, director } from 'cc';
import { aa } from '../../frame/FrameCore';
import CameraCtrl from './CameraCtrl';
import { events } from '../../frame/Enums';
import { quatFromAngleY } from '../../frame/CommonUtils';
const { ccclass, property } = _decorator;

const ctrl = aa.ctrl;

const position  /* as temp gridPos */ = { h: 0, v: 0 };
const vector  /* as temp gridPos */ = { h: 0, v: 0 };
const tempV3_0: Vec3 /* as temp Vec3 */ = new Vec3();
const tempQ_0: Quat /* as temp Quat */ = new Quat();
let _h = "x";
let _v = "z";

const speed = 4;
const rad = 180 / Math.PI;

@ccclass('PlayerControler')
export class PlayerCtrl extends Component {
    @property(SkeletalAnimation) anm: SkeletalAnimation;
    @property
    public speed = 1;

    @property(Node)
    public ball: Node = null!;
    @property(Node)
    public mic: Node = null!;
    camera: CameraCtrl;
    private _current = "";
    private _speedV = 0;
    private _speedH = 0;

    onEnable(): void {
        this.ball.scale = Vec3.ZERO;
        this.mic.scale = Vec3.ZERO;
        this.camera = aa.cameras[0].getComponent(CameraCtrl);
        director.on(events.playerAnm, this.play, this);
    }
    onDisable(): void {
        director.off(events.playerAnm, this.play, this);
    }
    play(anm: string) {
        if (anm == this._current || aa.ctrl.isPlaying) return;
        if (anm == "basketball") {
            this.ball.scale = Vec3.ONE;
            this.scheduleOnce(()=>{
                this.ball.scale = Vec3.ZERO;
            },3)
        }
        if (anm == "rap") {
            this.mic.scale = Vec3.ONE;
            this.scheduleOnce(()=>{
                this.mic.scale = Vec3.ZERO;
            },4)
        }
        this._current = anm;
        this.anm.crossFade(anm, 0.3)
    }

    update(dt: number) {

        if(aa.global.isPause) return;

        Vec3.copy(tempV3_0, this.node.position);
        position.h = tempV3_0[_h];
        position.v = tempV3_0[_v];
        let dirV = ctrl.v, dirH = ctrl.h, move = false;
        if (dirV != 0 || dirH != 0) {
            const speedMag = speed * dt * ctrl.mag;
            const eulerY = -Math.atan2(dirV, dirH) * rad + this.camera._targetRotation.y;
            const targetRad = eulerY / rad;
            this._speedH = lerp(this._speedH, speedMag * Math.sin(targetRad), dt * 5);
            this._speedV = lerp(this._speedV, speedMag * Math.cos(targetRad), dt * 5);
            quatFromAngleY(tempQ_0, eulerY);
            move = true;
            /* the maxStep should be angle instead of degree, already issued to engine team*/
            Quat.rotateTowards(tempQ_0, this.node.rotation, tempQ_0, dt * 360 * 1.8);
            position.h += this._speedH, position.v += this._speedV;
            tempV3_0[_h] = position.h, tempV3_0[_v] = position.v;
            this.node.rotation = tempQ_0;
            this.play("walk");
        } else {
            this._speedH = this._speedV = 0;
            this.play("idle");
        }
        if (move && !aa.ctrl.isPlaying) {
            tempV3_0[_h] = position.h, tempV3_0[_v] = position.v;
            this.node.position = tempV3_0;
        }



    }
}


