import { _decorator, Component, director, KeyCode, Label, Node, sys } from 'cc';
import { aa } from '../../frame/FrameCore';
import { KeyEvent } from '../../frame/input/InputCtrl';
import { events, ui } from '../../frame/Enums';
import { KeyConfigView } from '../../view/KeyConfigView';
const { ccclass, property } = _decorator;
const ctrl = aa.ctrl;

@ccclass('ActionConfig')
export class ActionConfig extends Component {

    @property(Label)
    labels:Label[] = [];

    public time = 0;

    _moveForward: KeyEvent = {
        down: () => {
            ctrl.h = 1;
        },
        up: () => {
            (ctrl.h > 0) && (ctrl.h = 0);
        }
    }
    _moveBackward: KeyEvent = {
        down: () => {
            ctrl.h = -1;
        },
        up: () => {
            (ctrl.h < 0) && (ctrl.h = 0);
        }
    }
    _moveLeft: KeyEvent = {
        down: () => {
            ctrl.v = -1
        },
        up: () => {
            (ctrl.v < 0) && (ctrl.v = 0);
        }
    }
    _moveRight: KeyEvent = {
        down: () => {
            ctrl.v = 1
        },
        up: () => {
            (ctrl.v > 0) && (ctrl.v = 0);
        }
    }
    _danceAction: KeyEvent = {
        down: () => {
            this.jump();
        }
    };
    _rapAction: KeyEvent = {
        down: () => {
            this.rap();
        }
    };
    _basketballAction: KeyEvent = {
        down: () => {
            this.ball();
        }
    };

    private _skillConfigs = {
        dance:{time:0,cd:5},
        rap:{time:0,cd:5},
        basketball:{time:0,cd:5}

    }
 
    onEnable(): void {
        if (sys.isMobile) return
        ctrl
        .add("forward",[KeyCode.KEY_W],this._moveForward,this.labels[0])
        .add("backward",[KeyCode.KEY_S],this._moveBackward,this.labels[1])
        .add("left",[KeyCode.KEY_A],this._moveLeft,this.labels[2])
        .add("right",[KeyCode.KEY_D],this._moveRight,this.labels[3])
        .add("dance",[KeyCode.KEY_X],this._danceAction,this.labels[4])
        .add("rap",[KeyCode.KEY_N,KeyCode.KEY_B],this._rapAction,this.labels[5])
        .add("basketball",[KeyCode.KEY_C,KeyCode.KEY_X],this._basketballAction,this.labels[6])
    }
    onDisable() {
        if (sys.isMobile) return
        ctrl
        .remove("forward")
        .remove("backward")
        .remove("left")
        .remove("right")
        .remove("dance")
        .remove("rap")
        .remove("ball")
    }


    async showConfig() {
        const configView = await aa.res.getUI(ui.ConfigView);
        configView.getComponent(KeyConfigView).init(this);
    }

    rap() {
        if (aa.ctrl.isPlaying) return;
        director.emit(events.playerAnm, "rap");
        aa.ctrl.isPlaying = true;
        this.time = 3.5;
    }

    jump() {
        if (aa.ctrl.isPlaying) return;
        director.emit(events.playerAnm, "dance");
        aa.ctrl.isPlaying = true;
        this.time = 4;
    }

    ball() {
        if (aa.ctrl.isPlaying) return;
        director.emit(events.playerAnm, "basketball");
        aa.ctrl.isPlaying = true;
        this.time = 3.5;
    }
 
    update(dt: number): void {
        if (this.time <= 0) {
            aa.ctrl.isPlaying = false;
        } else {
            this.time -= dt;
        }

       

    }

}

