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

  resize() {
    const rect = this.previewCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const targetWidth = rect.width * dpr;
    const targetHeight = rect.height * dpr;

    if (
      this.mainCanvas.width !== targetWidth ||
      this.mainCanvas.height !== targetHeight
    ) {
      let backup: ImageData | null = null;
      if (this.mainCanvas.width > 0 && this.mainCanvas.height > 0) {
        backup = this.mainCtx.getImageData(
          0,
          0,
          this.mainCanvas.width,
          this.mainCanvas.height,
        );
      }
      this.mainCanvas.width = targetWidth;
      this.mainCanvas.height = targetHeight;
      this.previewCanvas.width = targetWidth;
      this.previewCanvas.height = targetHeight;

      this.mainCtx.setTransform(1, 0, 0, 1, 0, 0);
      this.previewCtx.setTransform(1, 0, 0, 1, 0, 0);
      this.mainCtx.scale(dpr, dpr);
      this.previewCtx.scale(dpr, dpr);

      if (backup) {
        this.mainCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.mainCtx.putImageData(backup, 0, 0);
        this.mainCtx.scale(dpr, dpr);
      }
    }
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
