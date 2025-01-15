/**
 * Ascii generation is based on https://github.com/hassadee/jsascii/blob/master/jsascii.js
 *
 * 16 April 2012 - @blurspline
 */

class AsciiEffectProyeccionDebil {
  constructor(
    urlBase,
    outputCanvas,
    renderer,
    colorBase,
    charSet = " .:-=+*#%@",
    options = {}
  ) {
    // Some ASCII settings

    const fResolution = options["resolution"] || 0.15; // Higher for more details
    const iScale = options["scale"] || 1;
    const bColor = options["color"] || false; // nice but slows down rendering!

    let self = this;

    this.colorBaseGlobal = colorBase;
    this.invert = options["invert"] || false; // black is white, white is black
    this.colorFondo = options["colorFondo"] || { r: 255, g: 255, b: 255 };
    this.caracteres = charSet;

    let width, height;

    const domElement = document.createElement("div");

    let iWidth, iHeight;

    this.setSize = function (w, h) {
      width = w;
      height = h;

      renderer.setSize(w, h);

      initAsciiSize();
    };

    this.render = function (scene, camera) {
      renderer.render(scene, camera);
      asciifyImage();
    };

    this.domElement = domElement;

    function initAsciiSize() {
      iWidth = Math.floor(width * fResolution);
      iHeight = Math.floor(height * fResolution);
      3;

      oCanvas.width = iWidth;
      oCanvas.height = iHeight;
    }

    const aDefaultCharList = " .,:;i1tfLCG08@".split("");
    const aDefaultColorCharList = " CGO08@".split("");

    const oCanvasImg = renderer.domElement;

    const oCanvas = document.createElement("canvas");
    if (!oCanvas.getContext) {
      return;
    }

    const oCtx = oCanvas.getContext("2d");
    if (!oCtx.getImageData) {
      return;
    }

    let aCharList = bColor ? aDefaultColorCharList : aDefaultCharList;

    const fFontSize = (2 / fResolution) * iScale;

    function asciifyImage() {
      if (self.caracteres) aCharList = self.caracteres;

      oCtx.clearRect(0, 0, iWidth, iHeight);
      oCtx.drawImage(oCanvasImg, 0, 0, iWidth, iHeight);
      const oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;

      const targetCtx = outputCanvas.getContext("2d");
      targetCtx.font = fFontSize + "px courier new, monospace";
      targetCtx.textBaseline = "top";

      targetCtx.clearRect(0, 0, width, height);
      targetCtx.fillStyle = targetCtx.fillStyle =
        "rgb(" +
        self.colorFondo["r"] +
        "," +
        self.colorFondo["g"] +
        "," +
        self.colorFondo["b"] +
        ")";
      targetCtx.fillRect(0, 0, width, height);

      targetCtx.fillStyle =
        "rgb(" +
        self.colorBaseGlobal["r"] +
        "," +
        self.colorBaseGlobal["g"] +
        "," +
        self.colorBaseGlobal["b"] +
        ")";

      const margin = 0;

      for (let y = margin; y < iHeight - margin; y += 2) {
        for (let x = margin; x < iWidth - margin; x++) {
          const iOffset = (y * iWidth + x) * 4;

          const iRed = oImgData[iOffset];
          const iGreen = oImgData[iOffset + 1];
          const iBlue = oImgData[iOffset + 2];
          let iCharIdx;

          let fBrightness;

          fBrightness = (0.3 * iRed + 0.59 * iGreen + 0.11 * iBlue) / 255;

          iCharIdx = Math.floor((1 - fBrightness) * (aCharList.length - 1));

          if (self.invert) {
            iCharIdx = aCharList.length - iCharIdx - 1;
          }

          let strThisChar = aCharList[iCharIdx];

          targetCtx.fillText(
            strThisChar,
            (x * width) / iWidth,
            (y * height) / iHeight
          );
        }
      }
    }
  }
}

export { AsciiEffectProyeccionDebil };
