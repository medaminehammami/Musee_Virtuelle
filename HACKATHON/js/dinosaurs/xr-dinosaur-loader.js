import * as THREE from '../third-party/three.js/build/three.module.js';
import { AllDinosaurs } from './all-dinosaurs.js';

function trimEmptyLeadingKeyframes(animation) {
  let firstTime = animation.tracks[0].times[0];
  if (firstTime <= 0) return;
  for (let track of animation.tracks) {
    let firstTrackTime = track.times[0];
    if (firstTime > firstTrackTime) {
      firstTime = firstTrackTime;
      if (firstTime <= 0) return;
    }
  }

  animation.duration -= firstTime;
  for (let track of animation.tracks) {
    for (let i = 0; i < track.times.length; ++i) {
      track.times[i] -= firstTime;
    }
  }
}

export class XRDinosaurLoader {
  constructor(gltfLoader) {
    this._gltfLoader = gltfLoader;
    this._currentKey = null;
    this._currentDinosaur = null;
    this._loadedDinosaurs = {};
  }

  load(key) {
    const dinosaur = AllDinosaurs[key];
    if (!dinosaur) return Promise.reject(new Error('Invalid key'));
    if (key == this._currentKey) return Promise.resolve(this._currentDinosaur);

    this._currentKey = key;

    if (this._loadedDinosaurs[key]) {
      return this._loadedDinosaurs[key].then((loadedDinosaur) => {
        if (key == this._currentKey) this._currentDinosaur = loadedDinosaur;
        return loadedDinosaur;
      });
    }

    this._loadedDinosaurs[key] = new Promise((resolve) => {
      this._gltfLoader.setPath(dinosaur.path);
      let fileName = dinosaur.file || 'scene.gltf';
      this._gltfLoader.load(fileName, (gltf) => {
        gltf.scene.updateMatrixWorld(true);
        let bbox = new THREE.Box3().setFromObject(gltf.scene);
        let modelScale = dinosaur.height / (bbox.max.y - bbox.min.y);
        gltf.scene.scale.multiplyScalar(modelScale);
        gltf.scene.position.y -= bbox.min.y * modelScale;
        dinosaur.add(gltf.scene);
        for (let i = 0; i < gltf.animations.length; ++i) {
          trimEmptyLeadingKeyframes(gltf.animations[i]);
        }
        dinosaur.setAnimations(gltf.animations);
        if (key == this._currentKey) this._currentDinosaur = dinosaur;
        resolve(dinosaur);
      });
    });

    return this._loadedDinosaurs[key];
  }

  get currentDinosaur() {
    return this._currentDinosaur;
  }

  get allDinosaurs() {
    return AllDinosaurs;
  }
}
