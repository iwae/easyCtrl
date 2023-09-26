import { _decorator, Component, Node, Vec3 } from 'cc';
import { Clips, Props } from '../frame/Enums';
import { aa } from '../frame/FrameCore';
const { ccclass, property } = _decorator;

@ccclass('BaseView')
export class BaseView extends Component {

    @property({
        displayOrder: 0,
        group: Props.View
    })
    tweenView = true;
    @property({
        type: Node,
        visible() {
            return this.tweenView;
        },
        displayOrder: 0,
        group: Props.View
    })
    root: Node = null
    @property({
        visible() {
            return this.tweenView;
        },
        displayOrder: 0,
        group: Props.View
    })
    tweenTime = 0.25;
    @property({
        displayOrder: 0,
        group: Props.View
    })
    playBtnClip = true;

    @property({
  
        group: Props.Ad,
        tooltip: "show Banner on Start"
    })
    showBannerAd = false;

    @property({
        visible() {
            return this.showBannerAd;
        },
        range: [0, 5],
        group: Props.Ad
    })
    bannerDelay = 0;
    @property({
        visible() {
            return this.showBannerAd;
        },
        group: Props.Ad,
        tooltip: "hide Banner on Start"
    })
    hideBannerOnClose = true;
    @property({
        visible() {
            return this.showBannerAd;
        },
        group: Props.Ad
    })
    displayinSmallscreen = true;
    @property({
        group: Props.Ad,
        tooltip: "show Intersitial Ad on Start"
    })
    showIntersitialAd = false;
    @property({
        visible() {
            return this.showIntersitialAd;
        },
        range: [0, 5],
        group: Props.Ad
    })
    intersitialDelay = 0;
    @property({
        group: Props.Ad,
        tooltip: "show video Ad on Start"
    })
    showVideoAd = false;
    @property({
        visible() {
            return this.showVideoAd;
        },
        range: [0, 5],
        group: Props.Ad
    })
    videoDelay = 0;

    onEnable() {
        this.playBtnClip && aa.sound.play(Clips.btn);
        if (this.tweenView) {
            if (!this.root) {
                this.root = this.node;
                this.root.setScale(Vec3.ZERO);
                this.scheduleOnce(() => {
                    aa.utils.fadeIn(this.root);
                })
            } else {
                this.root.setScale(Vec3.ZERO);
                aa.utils.fadeIn(this.root);
            }

        }
        this.showAds();
    }

    onDisable(){
        if (this.hideBannerOnClose) {
            this.closeAd();
        }
    }

    close() {
        this.playBtnClip && aa.sound.play(Clips.btn, 0.5);
        if (this.showBannerAd) this.closeAd()
        if (this.tweenView) {
            if (!this.root) this.root = this.node;
            aa.utils.fadeOut(this.root, () => {
                aa.res.putNode(this.node);
            })
        } else {
            aa.res.putNode(this.node);
        }
    }
    showAds() {
   
        if (this.showBannerAd) {
            this.scheduleOnce(() => {
                this.showBanner();
            }, this.bannerDelay)
        }
        if (this.showIntersitialAd) {
            this.scheduleOnce(() => {
                this.showIntersitial();
            }, this.intersitialDelay)
        }
        if (this.showVideoAd) {
            this.scheduleOnce(() => {
                this.showVideo();
            }, this.bannerDelay)
        }

    }
    closeAd() {
    }

    showBanner() {
    }
    showVideo(CB = null) {

    }
    showIntersitial() {
    }

}

