export class CanvasEngine {
  private mainCanvas: HTMLCanvasElement;
  private previewCanvas: HTMLCanvasElement;
  public mainCtx: CanvasRenderingContext2D;
  public previewCtx: CanvasRenderingContext2D;

  constructor(main: HTMLCanvasElement, preview: HTMLCanvasElement) {
    this.mainCanvas = main;
    this.previewCanvas = preview;

    const ctx = main.getContext("2d");
    const pCtx = preview.getContext("2d");

    if (!ctx || !pCtx) throw new Error("Could not get 2D contexts");

    this.mainCtx = ctx;
    this.previewCtx = pCtx;
  }

  clearPreview() {
    const dpr = window.devicePixelRatio || 1;
    this.previewCtx.clearRect(
      0,
      0,
      this.previewCanvas.width / dpr,
      this.previewCanvas.height / dpr,
    );
  }

  clearMain() {
    const dpr = window.devicePixelRatio || 1;
    this.mainCtx.clearRect(
      0,
      0,
      this.mainCanvas.width / dpr,
      this.mainCanvas.height / dpr,
    );
  }

  commitPreviewToMain(drawCallback: (ctx: CanvasRenderingContext2D) => void) {
    drawCallback(this.mainCtx);
    this.clearPreview();
  }
}
