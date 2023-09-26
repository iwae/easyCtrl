import { _decorator, Color, Component, director, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

const selected = new Color(100,100,100,200);
const unSelected = new Color(100,100,100,100);

@ccclass('KeyBindingView')
export class KeyBindingView extends Component {
    key = "";
    @property(Sprite)
    bg:Sprite = null;
    @property(Label)
    nameLabel:Label = null;
    @property(Label)
    keyLabel:Label = null;

    onEnable(): void {
        this.bg.node.on(Node.EventType.TOUCH_END,this.onSelect,this); 
        director.on("duplicateKey",this.clearKeyName,this);
    }
    onDisable(): void {
        this.bg.node.off(Node.EventType.TOUCH_END,this.onSelect,this); 
        director.off("duplicateKey",this.clearKeyName,this);
    }

    /**
     * @en : clear key if values are the same
     * @cn : 清楚相同的按键信息
     * @param {string} v
     */
    clearKeyName(v:string){
        if(this.key ==v){
            this.keyName = "";
        }
    }

    set bindingName(v:string){
        if(this
            .nameLabel){
            this.nameLabel.string = v;
            this.key = v;
        }
    }
    set keyName(v:string){
        if(this.keyLabel){
            this.keyLabel.string = v;
        }
    }
    onSelect(){
        this.color = true;
        director.emit("KeyBindingSelect",this);
    }

    set color(select:boolean) {
        this.bg.color = select?selected:unSelected;
    }

   
}

