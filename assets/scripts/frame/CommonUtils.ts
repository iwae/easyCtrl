
import { _decorator, Sprite, SpriteFrame, Texture2D, ImageAsset, Node, screen, tween, Layers, Vec3, sys, UITransform, Widget, view, PolygonCollider2D, director, game, UIRenderer, IQuatLike } from 'cc';
import { DataType } from './Enums';

const halfToRad = 0.5 * Math.PI / 180.0;

const ONE = new Vec3(1, 1, 1);

const ZERO = new Vec3(0, 0, 0);

export function quatFromAngleY<Out extends IQuatLike>(out: Out, y: number) {
    y *= halfToRad;
    out.x = out.z = 0;
    out.y = Math.sin(y);
    out.w = Math.cos(y);
    return out;
}



class CommonUtils {

    hideRender(node: Node): void {

        const render = node.getComponent(UIRenderer);
        if (!render) return;

        //@ts-ignore
        render._renderFlag = false;
        //@ts-ignore
        render._renderEntity.enabled = false;


    }
    showRender(node: Node): void {

        const render = node.getComponent(UIRenderer);


        if (!render) return;
        //@ts-ignore
        render._renderFlag = true;
        //@ts-ignore
        render._renderEntity.enabled = true;

    }

    hideRenders(node: Node): void {

        const renders = node.getComponentsInChildren(UIRenderer);

        renders.forEach((render) => {
            //@ts-ignore
            render._renderFlag = false;
            //@ts-ignore
            render._renderEntity.enabled = false;
        })

    }
    showRenders(node: Node): void {

        const renders = node.getComponentsInChildren(UIRenderer);

        renders.forEach((render) => {
            //@ts-ignore
            render._renderFlag = true;
            //@ts-ignore
            render._renderEntity.enabled = true;
        })
    }

    save(key: any, val: string | number | any) {
        if (typeof val === "number") {
            val = "" + val as string;
        }
        /* 这里可以存云端 */
        this.saveLocalStorage(key, val || '')
    }
    /**
     * @description: load localstorage data,
     * @return {*}
     */
    load(key: string, type: DataType.STRING | DataType.NUMBER | DataType.OBJECT = DataType.NUMBER) {
        /* 这里可以从云端拿 */
        let res: any = this.loadLocalStorage(key);

        if (res) {
            switch (type) {
                case DataType.STRING:
                    break;
                case DataType.NUMBER:
                    res = Number(res);
                    break;
                case DataType.OBJECT:
                    res = JSON.parse(res);
                    break;
            }
            return res;
        } else {
            return null;
        }
    }


    /**
     * @description: save data into localstorage
     * @return {*}
     */
    saveLocalStorage(key: any, val: string | number | any) {
        sys.localStorage.setItem(key, val || '')
    }

    /**
     * @description: load localstorage data,
     * @return {*}
     */
    loadLocalStorage(key: string) {
        return sys.localStorage.getItem(key);
    }


    /**
     * @en : formate num to percentage
     * @cn : 数字转换成百分比
     * @param {number} num
     */
    formatPercentage(num: number): string | number {
        if (num < 2) {
            return (num * 100).toFixed(1) + '%';
        } else {
            return num;
        }
    }

    traverseObject(obj: any, callback: (key: string, value: any) => void): void {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                callback(key, value);
                if (typeof value === 'object') {
                    this.traverseObject(value, callback);
                }
            }
        }
    }

    getDay() {
        return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    }

    createUI(name: string = "uiNode", layer: number = Layers.Enum.UI_2D): Node {
        const size = view.getVisibleSize();
        const node = new Node(name)
        const transfrom = node.addComponent(UITransform);
        transfrom.setContentSize(size);
        const widget = node.addComponent(Widget);
        widget.isAlignLeft = widget.isAlignTop = widget.isAlignTop = widget.isAlignBottom = true;
        widget.right = widget.left = widget.top = widget.bottom = 0;
        node.layer = layer;
        return node;
    }

    /**
     * @description: generate a random data;
     * @return {*}
     */
    getDateId(): string {

        let d = new Date();

        let dates = d.getDay().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();

        let result = Math.floor(Number(dates) + Math.floor(Math.random() * (500000 * Math.random() + 50000)) * 0.1);

        return result.toString();
    }


    /**
     * @description: get the sys language
     * @return {*}
     */
    isEn(): boolean {
        return (navigator.language.indexOf("zh") != -1) ? false : true;
    }

    /**
     * @description: Clear UI node, and realse sprite's memory based on needs
     * @param {Node} node
     * @param {*} clear
     * @return {*}
     */
    clearUI(node: Node, clear = true) {

        if (clear) {
            const sp = node.getComponent(Sprite);
            sp && this.clearSprite(sp);
            const sps = node.getComponentsInChildren(Sprite);
            if (sps.length > 0) {
                sps.forEach((v) => {
                    /* Release mem */
                    this.clearSprite(v);
                })
            }

        }
        node.destroy();
    }
    /**
     * @Date: 2022-03-04 17:26:21
     * @LastEditors: iwae
     * @description: move towards
     * @param {Vec3} current current vec
     * @param {Vec3} target target
     * @param {number} maxDistanceDelta speed delta
     */
    MoveTowards(current: Vec3, target: [number, number], maxDistanceDelta: number) {
        // avoid vector ops because current scripting backends are terrible at inlining
        const toVector_x = target[0] - current.x;
        const toVector_y = target[1] - current.y;
        const sqdist = toVector_x * toVector_x + toVector_y * toVector_y;
        if (sqdist == 0 || (maxDistanceDelta >= 0 && sqdist <= maxDistanceDelta * maxDistanceDelta)) {
            current.set(target[0], target[1]);
            return true;
        }
        const dist = Math.sqrt(sqdist);

        current.x = + toVector_x / dist * maxDistanceDelta;
        current.y = + toVector_y / dist * maxDistanceDelta;

        return false;
    }


    /* node fade In */
    fadeIn(node: Node, dura = 0.2) {
        tween(node).set({ scale: Vec3.ZERO }).to(dura, { scale: ONE }).start();
    }

    fixedTo(num: number, precision = 2) {

        const perc = 10 ^ precision;

        num = Math.floor(num * perc) / perc;

        return num;

    }

    /**
     * @description: get a random target from targets
     * @return {*}
     */
    getRandomTarget(targets: Node[]): Node {

        let target: Node;

        const L = targets.length;

        if (L > 0) {

            target = targets[Math.floor(L * Math.random())];

        } else {

            target = null;
        }


        return target;
    }

    getQueryVariable(variable: string) {

        const url = decodeURIComponent(window.location.href);
        var str = url.split('?');
        var query = str[1];
        if (query) {
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }

        }

        return null;
    }


    /**
     * @description: get the closet nodes
     * @return {*}
     */
    getCloestNode(self: Node, targets: Node[]): Node {

        let closestNode: Node;

        const L = targets.length;

        if (L > 0) {

            let dis = 10000;

            for (var i = 0; i < L; i++) {

                const _node = targets[i];

                const _dis = this.getNodesDis(_node, self);

                if (_dis < dis) {

                    dis = _dis;

                    closestNode = _node;
                }

            }

        } else {

            closestNode = null;
        }


        return closestNode;
    }

    /**
     * @description: get node's mahatton dis to the target
     * @return {*}
     */
    getNodesDis(start: Node, end: Node): number {
        return this.getDistance(start.position, [end.position.x, end.position.y]);
    }

    getOne(): 1 | -1 {
        return (Math.random() > 0.5) ? 1 : -1;
    }

    getDistance(p1: Vec3, p2: [number, number]): number {
        /* we use Manhattan dis for better performance */
        const d = (Math.abs(p2[0] - p1.x) + Math.abs(p2[1] - p1.y));
        return d;
    }


    /* node fade In */
    fadeOut(node: Node, cb?) {
        tween(node).to(0.2, { scale: ZERO }, { easing: 'elasticOut' }).call(() => {
            cb && cb();
        }).start();
    }

    /**
     * @description: Clear sprite and release memory
     * @param {Sprite} sp
     * @return {*}
     */
    clearSprite(sp: Sprite) {
        const sf = sp.spriteFrame as SpriteFrame;
        if (sf) {
            sp.spriteFrame = null;
            if (sf && sf.refCount > 0) {
                sf.decRef();
                const tex = sf.texture as Texture2D;
                this.clearTex(tex)
            }
        }
    }

    /**
     * @description: Clear texture2D and release memory
     * @param {Texture2D} tex
     * @return {*}
     */
    clearTex(tex: Texture2D) {

        if (tex && tex.refCount > 0) {
            tex.decRef();
            const image = tex.image as ImageAsset;
            if (image && image.refCount > 0) {
                image.decRef();
            }
        }
    }

}
const COMMONUTILS = new CommonUtils;

export default COMMONUTILS;
