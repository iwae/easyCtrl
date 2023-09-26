# easyBinding
easyBinding is a Cocos frame, which make key binding super easy, it also includes a controller that super smooth

# Made with Cocos Creator 3.8
https://www.cocos.com/en/creator-download

# a lot Love with Kunkun

![55](https://github.com/iwae/easyBinding/assets/26038745/68080f81-9722-4c00-80ad-99bee7e49a1a)

# Super Easy for Keys Binding

![222](https://github.com/iwae/easyBinding/assets/26038745/f53e9575-bab7-4437-9a50-f560849cdeda)

```ts
  aa.ctrl
        .add("forward",[KeyCode.KEY_W],this._moveForward,this.labels[0])
        .add("backward",[KeyCode.KEY_S],this._moveBackward,this.labels[1])
        .add("left",[KeyCode.KEY_A],this._moveLeft,this.labels[2])
        .add("right",[KeyCode.KEY_D],this._moveRight,this.labels[3])
        .add("dance",[KeyCode.KEY_X],this._danceAction,this.labels[4])
        .add("rap",[KeyCode.KEY_N,KeyCode.KEY_B],this._rapAction,this.labels[5])
        .add("basketball",[KeyCode.KEY_C,KeyCode.KEY_X],this._basketballAction,this.labels[6])
```

# Easy for runtime Keys Binding Replacement

1 line code for keys binding replacement 

```ts
  aa.ctrl.updateBinding(binding.nameLabel.string,binding.keyLabel);
```

and supports combo!

![image](https://github.com/iwae/easyBinding/assets/26038745/57365647-3bb7-4a27-8fb5-a45b75993224)

# Fully Multi Languages Comments!

![image](https://github.com/iwae/easyBinding/assets/26038745/b27db849-c417-4db8-ae3d-4c85d90060dd)

# LOVELY KUNKUN 3D MODE, FREE TO USE

![2223](https://github.com/iwae/easyBinding/assets/26038745/36199a2f-36e7-43c4-80d7-81e9392b6eef)








