
import { _decorator, Component, Node, Vec3, Vec2, UIOpacity, tween, Touch, Quat } from 'cc';
import ctrl from './InputCtrl';

const { ccclass, property } = _decorator;

const _tempVec3 = new Vec3();
const _tempVec2 = new Vec2();
const _tempQuat = new Quat();
const rad = Math.PI/180;

@ccclass('JoystickCtrl')
export class JoystickCtrl extends Component {

    @property
    maxRadius = 60;

    @property({ type: Node })
    touchArea: Node | null = null;

    @property({ type: Node })
    control: Node | null = null;

    @property({ type: Node })
    indexArrow: Node = null!;

    @property({ type: Node })
    joyStick: Node = null!;

    distance: number = 0;

    private startPos = new Vec3();
    jumpBtn: Node = null!;

    arrowOp: UIOpacity = null;


    start() {
        this.init();
    }

    init() {
        this.joyStick.getPosition(this.startPos);
    }

    onEnable() {
        this.touchArea.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.touchArea.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.touchArea.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.touchArea.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.arrowOp = this.indexArrow.getComponent(UIOpacity);
        if(!this.arrowOp){
            this.arrowOp = this.indexArrow.addComponent(UIOpacity);
        }
        this.jumpBtn && this.jumpBtn.on(Node.EventType.TOUCH_END, this.jump, this);
        this.arrowOp.opacity = 0;
    }

    onDisable() {
        this.touchArea.off(Node.EventType.TOUCH_START, this.touchStart, this);
        this.touchArea.off(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.touchArea.off(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.touchArea.off(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.jumpBtn && this.jumpBtn.off(Node.EventType.TOUCH_END, this.jump, this);
    }


    touchStart(touch: Touch) {
        if (!this.joyStick.active) return;
        ctrl.joystick = true;
        tween(this.arrowOp).to(0.5, { opacity: 255 }).start();
        this.joyStick.setWorldPosition(touch.getUILocation().x, touch.getUILocation().y, 0);
    }

    touchMove(touch: Touch) {
        if (!this.joyStick.active) return;
        touch.getUILocation(_tempVec2);
        this.joyStick.getWorldPosition(_tempVec3);
        _tempVec2.x -= _tempVec3.x, _tempVec2.y -= _tempVec3.y;
        this.distance = _tempVec2.lengthSqr();
        this.distance = Math.min(this.distance,this.maxRadius);
        _tempVec2.normalize();
        ctrl.mag = (this.distance / this.maxRadius) * 1.2;
        ctrl.h = _tempVec2.y, ctrl.v = _tempVec2.x;
        _tempVec2.multiplyScalar(this.distance);
        const euler = -Math.atan2(_tempVec2.x, _tempVec2.y) / rad;
        this.indexArrow.rotation = Quat.fromAngleZ(_tempQuat,euler);
        this.control.setPosition(_tempVec2.x, _tempVec2.y);
    }

    jump() {
        ctrl.jump = true;
    }

    touchEnd() {
        if (!this.joyStick.active) return;
        ctrl.joystick = false;
        tween(this.arrowOp).to(0.6, { opacity: 0 }).start();
        ctrl.mag = 1;
        ctrl.h = 0;
        ctrl.v = 0;
        this.control.setPosition(Vec3.ZERO);
        this.joyStick.setPosition(this.startPos);
    }

}