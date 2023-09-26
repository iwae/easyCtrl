
import { _decorator, Component, Node, director, UIOpacity, Tween, view, Label } from 'cc';
import { events } from '../frame/Enums';
const { ccclass, property } = _decorator;

@ccclass('ToastCtrl')
export class ToastCtrl extends Component {

    @property(Label)
    text: Label = null;

    @property(UIOpacity)
    toast: UIOpacity = null;

    private _tw = new Tween();
    private time = 1;

    onEnable() {
        director.on(events.Toast, this.showToast, this);
        this.toast.opacity = 0;
        this._tw.target(this.toast);
        this._tw.set({ opacity: 0 }).to(0.6, { opacity: 255 }).delay(this.time).to(0.25, { opacity: 0 });
    }

    onDisable() {
        director.off(events.Toast, this.showToast, this);
    }

    /* show toast */
    showToast(text, time = 2) {

        this.time = time;

        this.text.string = text;

        this._tw.start();

    }


}


