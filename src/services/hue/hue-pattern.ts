/**
 * The settings of a single pattern tile or pixel
 *   - `null` means the light is off
 *   - color means the light should have that color
 */
export type HuePatternBlock = string | null;

/**
 * A pattern frame is the state of the pattern.
 * Multiple frames or states animates the pattern.
 */
export type HuePatternFrame = HuePatternBlock[];

export class HuePattern {
  /** A list of all pattern frame "states" */
  private frames: HuePatternFrame[];
  /** The current cursor of the pattern */
  private frameCursor: number = 0;
  /** The total amount of frames to render */
  private frameLength: number;
  /** The interval to transition between frames */
  private transitionSpeed: number = 500;

  constructor(frames: HuePatternFrame[], transitionSpeed: number = 500) {
    this.frames = frames;
    this.frameLength = frames.length;
    this.transitionSpeed = transitionSpeed;
  }

  /**
   * Get the current frame of the pattern.
   */
  getFrame() {
    return this.frames[this.frameCursor];
  }

  /**
   * Get the next frame of the pattern.
   * When it reaches the end, it's reset to the start.
   */
  nextFrame() {
    if (this.frameCursor + 1 < this.frameLength) {
      this.frameCursor += 1;
    } else {
      this.frameCursor = 0;
    }

    return this.getFrame();
  }

  /**
   * Get the amount of miliseconds to wait for each frame.
   */
  getTransitionSpeed() {
    return this.transitionSpeed;
  }

  static getWave() {
    const COLR = 'rgb(88, 68, 237)';
    const pattern = [
      [null, null, null, null, null],
      [null, null, COLR, null, null],
      [null, COLR, null, COLR, null],
      [COLR, null, null, null, COLR],
    ];

    return new HuePattern(pattern, 500);
  }

  static getKnightRider() {
    const COLR = 'red';
    const pattern = [
      [COLR, null, null, null, null],
      [null, COLR, null, null, null],
      [null, null, COLR, null, null],
      [null, null, null, COLR, null],
      [null, null, null, null, COLR],
      [null, null, null, COLR, null],
      [null, null, COLR, null, null],
      [null, COLR, null, null, null],
    ];

    return new HuePattern(pattern, 300);
  }

  static getComplex() {
    const CLR1 = 'blue';
    const CLR2 = 'purple';
    const pattern = [
      [CLR1, null, null, null, CLR1],
      [null, null, null, null, null],
      [CLR1, null, null, null, CLR1],
      [null, null, null, null, null],
      [CLR1, null, null, null, CLR1],
      [null, null, null, null, null],
      [CLR1, null, null, null, CLR1],
      [null, null, null, null, null],
      [CLR1, null, CLR1, null, CLR1],
      [null, null, null, null, null],
      [CLR1, CLR2, null, CLR2, CLR1],
      [null, null, null, null, null],
      [CLR1, null, CLR1, null, CLR1],
      [null, null, null, null, null],
      [CLR1, CLR2, null, CLR2, CLR1],
      [null, null, null, null, null],
      [null, CLR2, null, null, null],
      [null, null, CLR1, null, null],
      [null, null, null, CLR2, null],
      [null, null, CLR1, null, null],
      [null, CLR2, null, null, null],
      [null, null, CLR1, null, null],
      [null, null, null, CLR2, null],
    ];

    return new HuePattern(pattern, 500);
  }
}
