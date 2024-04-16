import * as THREE from '../third-party/three.js/build/three.module.js';

const DEFAULT_POSITION = [0, 0, -3];
const DEFAULT_ORIENTATION = Math.PI * 0.2;
const DEFAULT_HEIGHT = 3;
const DEFAULT_ANIMATION_SEQUENCE = ['Idle'];
const DEFAULT_DIE_ANIMATION = 'Die';
const DEFAULT_GET_UP_ANIMATION = 'Get_Up';

export class XRDinosaur extends THREE.Object3D {
  constructor() {
    super();

    this._scared = false;
    this._center = new THREE.Vector3();
    this._shadowNodes = null;
    this._mixer = new THREE.AnimationMixer(this);
    this._actions = {};
    this._currentAction = null;
    this._envMap = null;

    this.path = '';
    this.file = 'compressed.glb';
    this.shadowNodeNames = [];
    this.shadowSize = 3;
    this.animationSequence = DEFAULT_ANIMATION_SEQUENCE;
    this.dieAnimation = DEFAULT_DIE_ANIMATION;
    this.getUpAnimation = DEFAULT_GET_UP_ANIMATION;
    this.buttonAtlasOffset = [0, 0];

    this.height = DEFAULT_HEIGHT;
    this.position.fromArray(DEFAULT_POSITION);
    this.rotation.y = DEFAULT_ORIENTATION;
  }

  setAnimations(animations) {
    this.animations = animations;

    if (animations.length === 0) return;

    for (let i = 0; i < animations.length; ++i) {
      let animation = animations[i];
      let action = this._mixer.clipAction(animation);
      this._actions[animation.name] = action;
      if (animation.name == this.dieAnimation || animation.name == this.getUpAnimation) {
        action.loop = THREE.LoopOnce;
      }
    }

    let animationIndex = 0;
    let animationSequence = this.animationSequence;
    this._currentAction = this._actions[animationSequence[0]];
    this._currentAction.play();

    let nextAnimation = (e) => {
      if (e.action == this._actions[this.dieAnimation]) {
        this._mixer.stopAllAction();
        this._scared = false;
        this._currentAction = this._actions[this.getUpAnimation];
        this._currentAction.play();
      } else if (!this._scared) {
        this._mixer.stopAllAction();
        animationIndex = ++animationIndex % animationSequence.length;
        this._currentAction = this._actions[animationSequence[animationIndex]];
        this._currentAction.play();
      }
    }
    this._mixer.addEventListener('loop', nextAnimation);
    this._mixer.addEventListener('finished', nextAnimation);
  }

  set envMap(value) {
    this._envMap = value;
    this.traverse((child) => {
      if (child.isMesh) {
        child.material.envMap = value;
        child.material.needsUpdate = true;
      }
    });
  }

  scare() {
    if (this._scared) return;
    this._scared = true;

    this._currentAction.crossFadeTo(this._actions[this.dieAnimation], 0.25);
    this._currentAction = this._actions[this.dieAnimation];
    this._currentAction.play();
  }

  get shadowNodes() {
    if (!this._shadowNodes) {
      this._shadowNodes = [];
      this.traverse((child) => {
        if (this.shadowNodeNames &&
            this.shadowNodeNames.includes(child.name)) {
          this._shadowNodes.push(child);
        }
      });
    }
    return this._shadowNodes;
  }

  update(delta) {
    if (this._mixer) this._mixer.update(delta);
  }

  get center() {
    let bbox = new THREE.Box3().setFromObject(this);
    bbox.getCenter(this._center);
    return this._center;
  }
}
