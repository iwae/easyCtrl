
import { director, EventKeyboard, game, input, Input, KeyCode, Label, sys } from 'cc';

const responseTime = 150;/* in unit of ms */
const maxCombo = 3; /* limit of combo length */

export type KeyEvent = {
    down?: Function
    press?: Function
    up?: Function
}
export type KeyCombo = KeyCode[];

export type KeyBinding = {
    combo: KeyCombo,
    event: KeyEvent,
    label?: Label;
}
export type BindingConfig = {
    name: string,
    label?: Label
}
/**
 * @en : return the concet names from key comb
 * @cn : 返回组合键的名字
 * @param {KeyCombo} keys
 */
export function getComboName(keys: KeyCombo) {
    let label = "";
    keys.forEach((key) => {
        if (label.length > 0) {
            label += "+";
        }
        let keyCode = KeyCode[key].replace("KEY_", "");
        keyCode = keyCode.replace("DIGIT_", "");
        label += keyCode;
    })
    return label;
}
/**
 * @en : to identify if 2 arrays' contents are equal
 * @cn : 判断2个数组内的内容是否一致
 * @param {any} a
 * @param {any} b
 */
function arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

class InputCtrl {
    public h = 0
    public v = 0
    public mag = 1;
    public jump = false;
    public rad = 0;
    public joystick = false;
    public rap = false;
    public isPlaying = false;

    private keyEventMap = new Map<KeyCombo, KeyEvent>;
    private keyState = new Map<KeyCode, boolean>;
    private tempCombo: KeyCombo = [];
    private tempBinding: BindingConfig = null;
    private keyBindingMap = new Map<string, KeyBinding>;
    private timer = null;
    private lastKeyTime = 0;

    constructor() {
        if (!sys.isMobile) {
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
            var self = this;
            document.addEventListener('visibilitychange', function () {
                var isHidden = document.hidden;
                if (isHidden) {
                    if(self.timer){
                        clearTimeout(self.timer);
                    }
                    self.h = self.v = 0;
                    self.mag = 1;
                }
            });

        }
    }

    /**
     * @en : add new key binding 
     * @cn : 添加新的按键注册
     * @param {string} eventName  event Name
     * @param {KeyCombo} combo  keys, could be combos
     * @param {KeyEvents} keyEvent key events
     * @param {Label} label label
     */
    add(eventName: string, combo: KeyCombo, keyEvent: KeyEvent, label?: Label) {
        const config = this.keyBindingMap.get(eventName);
        if (config) {
            this.removeKey(config.combo);
        }
        const keyConfig: KeyBinding = { combo: combo, event: keyEvent, label: label };
        this.keyBindingMap.set(eventName, keyConfig);
        this.addKey(combo, keyEvent);
        if (label) {
            label.string = getComboName(combo);
        }
        return this;
    }

    /**
     * @en : clear a binding event
     * @cn : 清除绑定的事件
     * @param {string} eventName
     */
    clear(eventName: string) {
        const config = this.keyBindingMap.get(eventName);
        if (config) {
            config.combo.length = 0;
            if (config.label) {
                config.label.string = "";
            }
        }
        return this;
    }
 
    /**
     * @en : remove key binding
     * @cn : 移除按键注册
     * @param {string} eventName
     */
    remove(eventName: string) {
        const config = this.keyBindingMap.get(eventName);
        if (config) {
            this.removeKey(config.combo);
            this.keyBindingMap.delete(eventName);
            if (config.label) {
                config.label.string = "";
            }
        }
        return this;
    }
    /**
     * @en : get config map
     * @cn : 获取按键事件
     * @param {string} eventName
     */
    get(eventName: string) {
        return this.keyBindingMap.get(eventName) || null;
    }

    /**
     * @en :update key binding
     * @cn :更改绑定按键
     * @param string eventName 
     * @param {KeyCombo} combo new key combo
     * @param {Label} altlabel 是否更新文本
     */
    updateConfig(eventName: string, combo: KeyCombo, altlabel?: Label) {
        const config = this.keyBindingMap.get(eventName);
        if (!config) {
            console.log("no event founded==", eventName);
            return this;
        }
        combo.sort();
        for (let key of this.keyBindingMap.keys()) {
            const binding = this.keyBindingMap.get(key);
            const duplicate = arraysEqual(binding.combo,combo);
            if(duplicate){
                director.emit("duplicateKey",key);
                this.clear(key);
                break;
            }
        }
        config.combo.length = 0;
        for (var i = 0; i < combo.length; i++) {
            config.combo[i] = combo[i];
        }
        const keyString = getComboName(combo);
        if (config.label) {
            config.label.string = keyString;
        }
        if (altlabel) {
            altlabel.string = keyString;
        }
      
        return this;
    }
    /**
     * @en : clear temp binding and binding state
     * @cn : 清楚绑定状态
     */
    clearBinding(){
        this.tempBinding  =null;
    }

    /**
     * @en : updating new binding
     * @cn : 实时更新新的界面
     * @param {string} name binding name
     * @param {Label} label binding label if label, the label will be updated
     */
    updateBinding(name:string,label?:Label){
        this.tempBinding =  { name: name, label: label };
    }

    /**
     * @en : get all binding keys in array
     * @cn : 获取所有的绑定键数组
     */
    getKeys(){
        let actions = []
        for (let key of this.keyBindingMap.keys()) {
            actions.push(key);
        }
        return actions;
    }

    /**
     * @Description: add new combo with event
     * @param {KeyCode} keys use array for combination keys use single Keycode for single Key
     * @param {KeyEvents} event
     * @return {*}
     */
    private addKey(combo: KeyCombo, event: KeyEvent) {
        combo.sort();
        this.keyEventMap.set(combo, event);
        return this;
    }

    /**
     * @en : remove combo
     * @cn : 删除按键组合
     * @param {KeyCombo} combo
     */
    private removeKey(combo: KeyCombo) {
        
        this.keyEventMap.delete(combo);
        return this;
    }
 

    protected onKeyDown(event: EventKeyboard) {
        const keyCode = event.keyCode;
        if(this.tempBinding){

            this.handleBindingConfig(keyCode);

            return;
        }
       
        this.keyState.set(keyCode, true);
        for (let keys of this.keyEventMap.keys()) {
            let keystate = false;
            let length = keys.length;
            for (var i = 0; i < length; i++) {
                const key = keys[i];
                keystate = this.keyState.get(key);
                if (!keystate) {
                    break;
                }
            }
            if (keystate) {
                this.keyState.set(keyCode, false);
                const cb = this.keyEventMap.get(keys);
                if (cb.down) cb.down();
                break;
            }
        }

    }
    /**
     * @en : handle the keys combo that pressed within the responsetime
     * @cn : 处理相应时间内的的按键组合
     * @param {KeyCode} keyCode
     */
    private handleBindingConfig(keyCode:KeyCode){
        const bindingConfig = this.tempBinding;
            const time = game.totalTime;
            const deltaTime = time - this.lastKeyTime;
            /* clear tempCombo if delta time too long */
            if (deltaTime > responseTime) {
                this.tempCombo.length = 0;
            }
            if (this.tempCombo.length >= maxCombo) {
                this.tempCombo.shift();
            }
            this.tempCombo.push(keyCode);
            const name = bindingConfig.name;
            const label = bindingConfig.label;
            /* handle timeout*/
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.updateConfig(name, this.tempCombo, label);
                this.timer = null;
            }, responseTime);

            this.lastKeyTime = time;
    }
    protected onKeyPress(event: EventKeyboard) {
        const keyCode = event.keyCode;
    }

    protected onKeyUp(event: EventKeyboard) {
        const keyCode = event.keyCode;
        const bindingConfig = this.tempBinding;
        if (bindingConfig) {
            return;
        }
        this.keyState.set(keyCode, false);
        for (let keys of this.keyEventMap.keys()) {
            let keystate = false
            let length = keys.length;
            for (var i = 0; i < length; i++) {
                const key = keys[i];
                if (keyCode == key) {
                    keystate = true;
                    break;
                }
            }
            if (keystate) {
                const cb = this.keyEventMap.get(keys);
                if (cb.up) cb.up();
                break;
            }
        }
    }
}

const CTRL = new InputCtrl;

export default CTRL;
