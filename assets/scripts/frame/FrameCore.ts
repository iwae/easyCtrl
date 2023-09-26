import { Camera, Canvas, Node } from "cc";
import CTRL from "./input/InputCtrl";
import RES from "./managers/ResMgr";
import SOUND from "./managers/SoundMgr";
import GLOBALS from "./Globals";
import COMMONUTILS from "./CommonUtils";
import CameraCtrl from "../combat/ctrl/CameraCtrl";
const FSM = ""
/**
 * @en : Awesome Agent is a frame work for Cocos Creator, aa is easy to type
 * @cn : aa 框架是Cocos Creator 的游戏框架, aa 是输入最快的
 */
export namespace aa {
    /**
     * @en : res for loading resources and manage all assets(pool included)
     * @cn : res 是资源加载模块，里面读取包括了对象池
     */
    export const res = RES;
    /**
     * @en : sound is the module for control the audio fx and bgms
     * @cn : sound 控制bgm 和音效的声音模块
     */
    export const sound = SOUND;
    /**
    * @en : controller module for keyboard and joystick
    * @cn : 键盘控制器
    */
    export const ctrl = CTRL;
    /**
     * @en : common utils for game development
     * @cn : 常用的工具类合集
     */
    export const utils = COMMONUTILS;

    /**
     * @en : finited state machine
     * @cn : 有限状态机
     */
    export const fsm = FSM;
    /**
     * @en : global varients
     * @cn : 全局变量
     */
    export const global = GLOBALS;
    /**
     * @en : canvas containers, index 0 for default
     * @cn : canvas 画布容器，序号0 是默认的
     */
    export const canvas: Canvas[] = GLOBALS.canvas;

    /**
     * @en : cameras container, index 0 for 3D, index 1 for 2D cameras
     * @cn : 相机容器，序号0 是3D， 序号1 是2D
     */
    export const cameras: Camera[] = GLOBALS.cameras;
    /**
     * @en : 2d root layers container
     * @cn : 2d 根节点容器
     */
    export const layer2D: Node[] = GLOBALS.layer2D;
    /**
     * @en : 3d root layers container
     * @cn : 3d 根节点容器
     */
    export const layer3D: Node[] = GLOBALS.layer3D;

    export const states = {
        /**
         * @en : if game is paused
         * @cn : 游戏是否暂停
         */
        isPause: true,
    }

}




