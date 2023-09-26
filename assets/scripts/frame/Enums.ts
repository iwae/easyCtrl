
import { AudioClip, CCString, JsonAsset, Material, Prefab, SpriteAtlas, SpriteFrame, _decorator, __private } from "cc";
const { ccclass, property } = _decorator;

@ccclass('adConfig')
export class adConfig {
    @property
    platform = "platform";
    @property
    id = 0
    @property({ type: CCString })
    bannerId: string[] = [];
    @property({ type: CCString })
    intersitialId: string[] = [];
    @property({ type: CCString })
    videoId: string[] = [];
    @property({ type: CCString })
    customId: string[] = [];
}
@ccclass('shareContent')
export class shareContent {
    @property
    shareId: string = "";
    @property
    shareLink: string = "";
    @property
    shareText: string = "share tittle";
}


@ccclass('shareConfig')
export class shareConfig {
    @property
    platform = "platform";
    @property({ type: shareContent })
    sharePics: shareContent[] = [];
}
export const collisions = {
    DEFAULT: 1,
    player: 2,
    trap: 4,
    water: 8,
    brick: 16,
    enemy: 32,
}
export interface uiInterface {
    name:string,
    layer:number,
    clear:boolean

}
/* for ui prefabs config */
export const ui= {
    JoystickView: { name: 'JoystickView', layer: 1, clear: false },
    ActionView: { name: 'ActionView', layer: 2, clear: false },
    ConfigView: { name: 'ConfigView', layer: 3, clear: false },
    ToastView: { name: 'ToastView', layer: 6, clear: false },
}

export enum itemState {
    OWNEQUIPED,
    EQUIPED,
    NEWEQUIP,
    UNEQUIPED
}
export enum DataType {
    STRING,
    NUMBER,
    OBJECT
}

export const events = {
    changeCharacter:"changeCharacter",
    shakeCam: "shakeCam",
    playerAnm: "playerAnm",
    initLevel: "initLevel",
    gameWin: "gameWin",
    startDraw: "startDraw",
    finishDraw: "finishDraw",
    showResult: "showResult",
    buildMap: "buildMap",
    paperOcacity: "paperOcacity",
    editMap: "editMap",
    playMap: "playMap",
    rollBg: "rollBg",
    changeTop: "changeTop",
    catWatch: "catWatch",
    Toast: "toast",
    Anm: "anm",
}

export const anms = {
    cry: "cry",
    idle: "idle",
    hurt: "hurt",
    happy: "happy",

}
export const StorageKeys = {
    CharacterData: "CharacterData",
}

/* keys for storage */
export const Key = {
    MapData: "MapData",
    CurrentPen: "CurrentPen",
    Sound: "Sound",
    Bgm: "Bgm",
    Pens: "Pens",
    Pause: "Pause",
    Timer: "Timer",
    Level: "Level",
    Frost: "Frost",
    Undo: "Undo",
    Energy: "Energy",
    Star: "Star",
}


export const Props = {
    Scenes: "Scenes",
    Layers: "Layers",
    Comps: "Components",
    ShareConfig: "ShareConfig",
    Setting: "Setting",
    View: "View",
    AdConfig: "AdConfig",
    Ad: "Advertisement",
}

export const Clips = {
    hurt: "hurt",
    happy: "happy",
    bgm: "bgm",
    photo: "photo",
    counter: "counter",
    btn: "btn",
    touch: "touch",
    gold: "gold",
    reward: "reward",
    merge: "merge",
    win: "win",
    lose: "lose",
}

export type AssetType = {
    type: any,
    path: string
}

/**
 * assettypes and paths
 */
export const AssetType = ({
    Prefab: { type: Prefab, path: "Preload/Prefabs" } as AssetType,
    Sprite: { type: SpriteFrame, path: "Preload/Sprite" } as AssetType,
    UiPrefab: { type: Prefab, path: "Preload/UI" } as AssetType,
    Json: { type: JsonAsset, path: "Preload/Jsons/" } as AssetType,
    Sound: { type: AudioClip, path: "Preload/Clips/" } as AssetType,
    Atlas: { type: SpriteAtlas, path: "Preload/Atlas/" } as AssetType,
    Material: { type: Material, path: "Preload/Materials/" } as AssetType

})




