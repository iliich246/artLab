import { makeObservable, observable, action } from "mobx";
import AbstractAnimator from "../AnimationBuilder/AbstractAnimator";
import ThreeAnimator from "../AnimationBuilder/ThreeAnimator";
import ThreeApp from "./ThreeApp";
import Particles from "./Particles";
import sample from "../../assets/sample-02.png";

export class ParticlePhoto extends ThreeAnimator { 
  threeApp: ThreeApp | undefined;
  particles: Particles | undefined;

  constructor() {
    super();

  }

  public initialization() {
    super.initialization();

    this.threeApp = new ThreeApp(this);
  }

  render() {

  }

  protected resize(): void {
      
  }
}

const particlePhoto = new ParticlePhoto();
export default particlePhoto;
