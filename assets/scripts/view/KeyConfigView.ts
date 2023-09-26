import { _decorator, Component, director, instantiate, Node, Prefab } from 'cc';
import { KeyBindingView } from './KeyBindingView';
import { getComboName } from '../frame/input/InputCtrl';
import { aa } from '../frame/FrameCore';
import { ActionConfig } from '../combat/ctrl/ActionConfig';
import { BaseView } from './BaseView';
const { ccclass, property } = _decorator;
const ctrl = aa.ctrl;
@ccclass('KeyConfigView')
export class KeyConfigView extends BaseView {
    @property(Node)
    bg:Node = null;
    @property(Prefab)
    bindingView: Prefab = null;
    @property(Node)
    layout: Node = null;
    currentBinding: KeyBindingView = null;
    _bindingViews: KeyBindingView [] = [];
    actionConfig: ActionConfig = null;

    init(action:ActionConfig){
        this.actionConfig = action;
    }

    onEnable(): void {
        aa.global.isPause = true;
        director.on("KeyBindingSelect", this.onSelect, this);
        let actions = aa.ctrl.getKeys();
        const viewLenth = this._bindingViews.length;
        if (viewLenth < actions.length) {
            for(var i=viewLenth;i<actions.length;i++){
                const newBindingView = instantiate(this.bindingView);
                newBindingView.parent = this.layout;
                const bindingView= newBindingView.getComponent(KeyBindingView);
                this._bindingViews.push(bindingView);
            }
        }

        this._bindingViews.forEach((view,i)=>{
            const action = actions[i];
            view.bindingName = action;
            const config = ctrl.get(action);
            if(config){
                const keyLabel = getComboName(config.combo);
                view.keyName = keyLabel;
            }
        })
        this.bg&&this.bg.on(Node.EventType.TOUCH_END,this.clearSelect,this);
    }
  
    onDisable(): void {
        if (this.currentBinding) {
            this.currentBinding.color = false;
        }
        ctrl.clearBinding();
        this.bg&&this.bg.off(Node.EventType.TOUCH_END,this.clearSelect,this);

        aa.global.isPause = false;
    }
    clearSelect(){
        if (this.currentBinding) {
            this.currentBinding.color = false;
            this.currentBinding = null;
        }
        ctrl.clearBinding();
    }

    onSelect(binding: KeyBindingView) {
        if (this.currentBinding) {
            this.currentBinding.color = false;
        }
        ctrl.updateBinding(binding.nameLabel.string,binding.keyLabel);
        this.currentBinding = binding;
        binding.color = true;
    }

    close() {
        super.close();
    }


}

