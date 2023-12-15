import { makeObservable, observable, action } from "mobx";
import * as TWEEN from "@tweenjs/tween.js";

/**
 * @class AbstractAnimator
 */
abstract class AbstractAnimator {
  public static isServer = typeof window === "undefined";
  private static _idCounter = 0;
  private static _isTweenInitialized = false;
  private static _isResizeInitialized = false;

  /**
   * Keeps all instances of animators
   * @protected
   */
  protected static instances: AbstractAnimator[] = [];
  /**
   * Keeps child of this object.
   * @protected
   */
  protected children: AbstractAnimator[] = [];
  /**
   * Keeps parent object if this object is part of group
   * @protected
   */
  protected parent: AbstractAnimator | null = null;

  /**
   * Keepers for life cycle event handlers
   * @private
   */
  private _initEvents: Function[] = [];
  private _startEvents: Function[] = [];
  private _startCompleteEvents: Function[] = [];
  private _endEvents: Function[] = [];
  private _endCompleteEvents: Function[] = [];

  /**
   * Keepers for render events
   * @private
   */
  private _beforeRenderingEvents: Function[] = [];
  private _afterRenderingEvents: Function[] = [];

  /**
   * Unique id of the object
   */
  public id: number;

  /**
   * Order of the rendering where animated object is the part of the group
   * @protected
   */
  protected renderOrder: number = 0;

  /**
   * @Observable by mobx fields of animator object lifecycle
   */
  public isInitialized = false;
  public isAnimating = false;
  public isStartRunning = false;
  public isMainLoopRunning = false;
  public isEndRunning = false;

  /**
   *
   * @protected
   */
  protected constructor() {
    this.id = AbstractAnimator._idCounter;
    AbstractAnimator._idCounter++;
    AbstractAnimator._runTween();
    AbstractAnimator._runResizeHandler();
    AbstractAnimator.instances.push(this);

    makeObservable(this, {
      isInitialized: observable,
      initialization: action,
      isAnimating: observable,
      isStartRunning: observable,
      isMainLoopRunning: observable,
      isEndRunning: observable,
      startSequence: action,
      startSequenceCompleted: action,
      startImmediately: action,
      endSequence: action,
      endSequenceCompleted: action,
      endImmediately: action,
    });
  }

  /**
   * Configure tween update, animation loop and rendering
   * @private
   */
  private static _runTween(): void {
    if (AbstractAnimator.isServer) return;

    if (AbstractAnimator._isTweenInitialized) return;

    AbstractAnimator._isTweenInitialized = true;

    const tweenAnimateLoop = () => {
      requestAnimationFrame(tweenAnimateLoop);
      TWEEN.update();

      AbstractAnimator.instances.forEach(instance => {
        if (instance.parent) return;

        if (instance.isAnimating && instance.children) {
          const sortedChildren = instance.children.slice(0).sort(
            (a, b) => a.renderOrder - b.renderOrder
          );

          instance._beforeRenderingEvents.forEach(callback => callback());
          instance.render();
          instance._afterRenderingEvents.forEach(callback => callback());

          sortedChildren.forEach(sortedInstance => sortedInstance.isAnimating && sortedInstance.render());
        } else {
          instance.isAnimating && instance.render();
        }
      });
    }

    requestAnimationFrame(tweenAnimateLoop);
  }

  /**
   * Configure resize handlers for all instances of animation objects
   * @private
   */
  private static _runResizeHandler() {
    if (AbstractAnimator.isServer) return;

    if (AbstractAnimator._isResizeInitialized) return;

    AbstractAnimator._isResizeInitialized = true;

    window.addEventListener("resize", () => {
      AbstractAnimator.instances.forEach(instance => {
        instance.isAnimating && instance.resize();
      });
    });
  }

  /**
   * Adds a child and creates group
   * @param child
   * @protected
   */
  protected addChild(child:AbstractAnimator): void {
    this.children.push(child);
    child.parent = this;
  }

  /**
   * Sets render priority if this object is part of the group
   * @param order
   */
  public setRenderOrder(order:number) {
    this.renderOrder = order;
  }

  /**
   * Methods of animation lifecycle
   * In this methods in child classes should be implemented specific animation
   * @param triggerChildren if true, triggers the same method for the all child in the group
   *
   * In this method should define all necessary object and conditions for animation,
   * attach events, but it should not start animation. This method should be called one time,
   * other calls will be ignored
   * @param triggerChildren
   */
  public initialization(triggerChildren = true): void {
    if (this.isInitialized) return;

    this.isInitialized = true;
    triggerChildren && this.children.forEach(child => child.initialization());
    this._initEvents.forEach(callback => callback());
  }

  /**
   * StartSequence method should start begin animation
   * @param triggerChildren
   */
  public startSequence(triggerChildren = true): void {
    this.isAnimating = true;
    this.isStartRunning = true;
    triggerChildren && this.children.forEach(child => child.startSequence());
    this._startEvents.forEach(callback => callback());
  }

  /**
   * StartSequenceCompleted method should be called when start sequence is completed
   * @param triggerChildren
   */
  public startSequenceCompleted(triggerChildren = true): void {
    this.isStartRunning = false;
    this.isMainLoopRunning = true;
    triggerChildren && this.children.forEach(child => child.startSequenceCompleted());
    this._startCompleteEvents.forEach(callback => callback());
  }

  /**
   * This method should be implemented in child classes in cases when you need to skip start animation
   * @param triggerChildren
   */
  public startImmediately(triggerChildren = true): void {
    this.isAnimating = true;
    this.isMainLoopRunning = true;
    triggerChildren && this.children.forEach(child => child.startImmediately());
    this._startEvents.forEach(callback => callback());
    this._startCompleteEvents.forEach(callback => callback());
  }

  /**
   * StartSequence method should start end animation
   * @param triggerChildren
   */
  public endSequence(triggerChildren = true): void {
    this.isMainLoopRunning = false;
    this.isEndRunning = true;
    triggerChildren && this.children.forEach(child => child.endSequence());
    this._endEvents.forEach(callback => callback());
  }

  /**
   * EndSequenceCompleted method should be called when end sequence is completed
   * @param triggerChildren
   */
  public endSequenceCompleted(triggerChildren = true): void {
    this.isAnimating = false;
    this.isEndRunning = false;
    triggerChildren && this.children.forEach(child => child.endSequenceCompleted());
    this._endCompleteEvents.forEach(callback => callback());
  }

  /**
   * This method should be implemented in child classes in cases when you need to skip end animation
   * @param triggerChildren
   */
  public endImmediately(triggerChildren = true): void {
    this.isMainLoopRunning = false;
    this.isAnimating = false;
    triggerChildren && this.children.forEach(child => child.endImmediately());
    this._endEvents.forEach(callback => callback());
    this._endCompleteEvents.forEach(callback => callback());
  }

  /**
   * Events fires on initialization
   * @param callback
   */
  onInitialization(callback: () => void): void {
    this._initEvents.push(callback);
  }

  /**
   * Events fires on begin sequence
   * @param callback
   */
  onStartBeginSequence(callback: () => void): void {
    this._startEvents.push(callback);
  }

  /**
   * Events fires on begin sequence complete
   * @param callback
   */
  onStartCompleteSequence(callback: () => void): void {
    this._startCompleteEvents.push(callback);
  }

  /**
   * Events fires on start of end sequence
   * @param callback
   */
  onEndBeginSequence(callback: () => void): void {
    this._endEvents.push(callback);
  }

  /**
   * Events fires on end sequence complete
   * @param callback
   */
  onEndCompleteSequence(callback: () => void): void {
    this._endCompleteEvents.push(callback);
  }

  /**
   * Events fires before every render
   * @param callback
   */
  onBeforeRender(callback: () => void): void {
    this._beforeRenderingEvents.push(callback);
  }

  /**
   * Events fires after every render
   * @param callback
   */
  onAfterRender(callback: () => void): void {
    this._afterRenderingEvents.push(callback);
  }

  /**
   * This method automatic called on each instance on resize
   * @protected
   */
  protected abstract resize(): void;

  /**
   * This method automatic called and every render frame and if animation of this object in process
   * @protected
   */
  protected abstract render(): void;
}

export default AbstractAnimator;
