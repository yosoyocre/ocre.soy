class Folio {
  constructor() {
    // Creamos un A4
    this.width = 700;
    this.height = this.width * 1.414;

    createCanvas(this.width, this.height);

    this.canvas = document.querySelector("canvas");

    // Permitimos descargar el cartel
    this.canvas.addEventListener("click", function (e) {
      e.preventDefault();

      var link = document.createElement("a");
      link.download = "cartel.png";
      link.href = this.toDataURL("image/png");
      link.click();
    });

    // Quitamos el ancho y el alto para que se ajuste al contenedor
    $("canvas").width("").height("");
  }
}
