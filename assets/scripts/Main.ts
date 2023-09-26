import { _decorator, Camera, Canvas, Component, director, instantiate, Node, sys } from 'cc';
import { aa } from './frame/FrameCore';
import { AssetType, events, ui } from './frame/Enums';
import { DEBUG } from 'cc/env';
import CameraCtrl from './combat/ctrl/CameraCtrl';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(Camera)
    camera:Camera = null;

    public static ins: Main = null;
    

    onLoad() {
        Main.ins = this;
    }

    async start() {
        await this.loadRes();
    }

    /**
     * @description: init game
     * @return {*}
     */
    initGame() {
        this.createLayers();
        aa.res.getUI(ui.ToastView);
        aa.res.getUI(ui.ActionView);
        this.startGame();
    
    }

    /**
     * @en : create 2D/3D root layers
     * @cn : 创建2d和3d根节点
     */
    createLayers(){
        const scene = director.getScene();
        const canvas = scene.getComponentInChildren(Canvas).node;
        const layer2D = aa.global.layer2D;
        for (var i = 0; i <= 7; i++) {
            /* if layer0 exist, we clone it, otherwise create a new one */
            const node = layer2D[0] ? instantiate(layer2D[0]) : aa.utils.createUI();
            node.name = "layer2D" + i;
            node.parent = canvas;
            layer2D[i] = node;
        }
        const layer3D = aa.global.layer3D;

        for (var i = 0; i <= 3; i++) {
            /* if layer0 exist, we clone it, otherwise create a new one */
            const node = new Node();
            node.name = "layer3D" + i;
            node.parent = this.node.parent;
            layer3D[i] = node;
        }
        const cameras = aa.global.cameras;
        cameras[0] = this.camera;
    }

    startGame() {
        if(sys.isMobile || DEBUG){
            aa.res.getUI(ui.JoystickView);
        }
        aa.res.getNode("Land",aa.layer3D[0]);
        /* init player */
        const player = aa.res.getNode("Player",aa.layer3D[1]);
        const cam = this.camera.getComponent(CameraCtrl);
        cam.target = player;
        cam.init();
        director.emit(events.Toast, "UI and Logic by iwae, a lovely chick, with a lot love ^ ^", 5);
        aa.sound.startBgm("bgm");
    }


    /* load game res */
    async loadRes() {
        await aa.res.loadBundle(1, 0.1);
        await aa.res.loadRes(1, AssetType.Prefab, 0.8);
        await aa.res.loadRes(1, AssetType.Sound, 0.1);
    }

}

