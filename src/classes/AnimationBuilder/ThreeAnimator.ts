import { makeObservable, observable, action } from "mobx";
import AbstractAnimator from "../AnimationBuilder/AbstractAnimator";

export default abstract class ThreeAnimator extends AbstractAnimator { 
  public threeContainer: HTMLDivElement | undefined;
  public isTreeContainerInitialized = false;

  constructor() {
    super();
    makeObservable(this, {
      isTreeContainerInitialized: observable,
      setThreeContainer: action
    });
  }

  public initialization() {
    if (!this.isTreeContainerInitialized) {
      throw Error("You should setThreeContainer first before using this class");
    }
    super.initialization();
  }

  public setThreeContainer(container: HTMLDivElement) {
    if (!container) return;

    this.threeContainer = container;
    this.isTreeContainerInitialized = true;
  }
}
