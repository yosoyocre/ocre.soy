/**
 * Ascii generation is based on https://github.com/hassadee/jsascii/blob/master/jsascii.js
 *
 * 16 April 2012 - @blurspline
 */

class AsciiVideoDebil {
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
    const bInvert = options["invert"] || false; // black is white, white is black
    const strResolution = options["strResolution"] || "low";
    const conTextoPortada =
      options["conTextoPortada"] !== undefined
        ? options["conTextoPortada"]
        : true;
    let margin = options["margen"] !== undefined ? options["margen"] : 4;

    this.colorGlobal = colorBase;
    this.caracteres = charSet;

    let self = this;

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

    const fFontSize = (2 / fResolution) * iScale;

    const front = new Image();

    front.src = urlBase + "img/front.png";

    function asciifyImage() {
      let aCharList;
      if (self.caracteres) aCharList = self.caracteres;
      oCtx.clearRect(0, 0, iWidth, iHeight);
      oCtx.drawImage(oCanvasImg, 0, 0, iWidth, iHeight);
      const oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;

      const targetCtx = outputCanvas.getContext("2d");
      targetCtx.font = fFontSize + "px courier new, monospace";
      targetCtx.textBaseline = "top";

      targetCtx.clearRect(0, 0, width, height);
      targetCtx.fillStyle = "rgb(0, 0, 0)";
      targetCtx.fillRect(0, 0, width, height);

      targetCtx.fillStyle =
        "rgb(" +
        self.colorGlobal["r"] +
        "," +
        self.colorGlobal["g"] +
        "," +
        self.colorGlobal["b"] +
        ")";

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

          if (bInvert) {
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

      if (conTextoPortada) {
        targetCtx.drawImage(front, 0, 0, width, height);
      }
    }
  }
}

export { AsciiVideoDebil };
