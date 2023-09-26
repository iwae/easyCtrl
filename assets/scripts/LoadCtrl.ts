

import { _decorator, Color, Component, Node, Sprite, view } from 'cc';
import { Main } from './Main';
import { aa } from './frame/FrameCore';
const { ccclass, property } = _decorator;

const startColor = 150;
const colorRatio = (255-startColor);
const color = new Color(startColor,startColor,startColor);

@ccclass('LoadCtrl')
export class LoadCtrl extends Component {

    @property(Sprite)
    load: Sprite = null;
    @property(Sprite)
    bg: Sprite = null;


    private isload = true;
    private fill = 0;

    
    protected start(): void {
        this.bg.color = color;
    }

    closeLoad() {
        this.isload = false;
        Main.ins.initGame();
        aa.utils.clearUI(this.node);
    }


    update(deltaTime: number) {
        if (!this.isload) return;

        const rate = aa.res.loadingRate;

        this.fill +=0.01;

        if(this.fill>rate) this.fill = rate;

        color.r = color.g = color.b =startColor+colorRatio*this.fill;

        this.bg.color = color;

        this.load.fillRange = this.fill;

        if (this.fill >= 0.99) {
            this.closeLoad();
        }

    }
}

