var IMAGEN_DIBUJADA = false;

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

function copiaArray(array) {
  let arrayCopia = [];
  for (let i = 0; i < array.length; i++) {
    arrayCopia[i] = [];
    for (let j = 0; j < array[i].length; j++) {
      arrayCopia[i][j] = array[i][j];
    }
  }

  return arrayCopia;
}

document
  .querySelector(".js-otro-poster")
  .addEventListener("click", function (e) {
    e.preventDefault();

    console.log("Generando otro poster");

    IMAGEN_DIBUJADA = false;
  });
