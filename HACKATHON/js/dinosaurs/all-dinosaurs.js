
import { XRDinosaur } from './xr-dinosaur.js';

export class Ankylosaurus extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/ankylosaurus/';
    this.buttonAtlasOffset = [0, 0];

    this.shadowNodeNames = [
      'Ankylosaurus_L_Toe0_031',
      'Ankylosaurus_R_Toe0_036',
      'Ankylosaurus_L_Hand_09',
      'Ankylosaurus_R_Hand_014',
      'Ankylosaurus_Tail03_040',
      'Ankylosaurus_Jaw_018'
    ];
    this.shadowSize = 2.5;

    this.animationSequence = ['Idle', 'Idle_2', 'Idle_3'];

    this.height = 1.8;
    this.position.set(0, 0, -5);
  }
}




export class Tyrannosaurus extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/tyrannosaurus/';
    this.buttonAtlasOffset = [0.5, 0.25];

    this.shadowNodeNames = [
      'TRex_L_Toe01_038',
      'TRex_R_Toe01_044',
      'TRex_Tail03_048'
    ];
    this.shadowSize = 4.0;

    this.animationSequence = ['Idle', 'Look_Back', 'Idle', 'Look_Side', 'Idle', 'Stomp'];

    this.height = 5;
    this.position.set(0, 0, -7);
  }
}

export let AllDinosaurs = {
  ankylosaurus: new Ankylosaurus(),


  trex: new Tyrannosaurus(),
};

