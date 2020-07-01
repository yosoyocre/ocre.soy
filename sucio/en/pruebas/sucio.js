let canvasW = 1400;
let canvasH = 1400;

let front;

let figuras = [];

function preload() {
	front = loadImage('front.png');
}

function setup() {

	let tamanoCelda = 20;
	let grosorLinea = random(5, 8);
	// let grosorLinea = 5;
	let ruido = round(random(0, 0.6));
	// let ruido = 0.5;

	let mediaCelda = tamanoCelda / 2;
	let xMedio = canvasW / 2;
	let yMedio = canvasH / 2;

	let centroTx = canvasW / 2;
	let centroTy = canvasH / 2;
	let margenX = (canvasW - floor(canvasW / tamanoCelda) * tamanoCelda) / 2;
	let margenY = (canvasH - floor(canvasH / tamanoCelda) * tamanoCelda) / 2;

	let formas = ['circulo', 'cuadrado', 'triangulo'];

	let forma = random(formas);
	// let forma = 'triangulo';
	let matiz = round(random(0, 255));

	// Cálculo de figuras

	function tercioIzquierda(x, y) {
		return sqrt(3) * (x - centroTx) + y;
	}

	function tercioDerecha(x, y) {
		return -1 * sqrt(3) * (x - centroTx) + y;
	}

	function tercioAbajo(x, y) {
		return y;
	}

	// Colores

	function randomColor(h) {
		let s = round(random(30, 100));
		let l = round(random(0, 100));
		let rColor = color('hsl(' + h + ', ' + s + '%, ' + l + '%)');

		return rColor;
	}

	// Dibujo de trazos

	function coordenada(x, y, tamano) {
		return [
			round(x - tamano / 2 + tamano * random()),
			round(y - tamano / 2 + tamano * random())
		];
	}
	
	// Construcción de figuras

	let nPuntos;

	for (let x = margenX + mediaCelda; x < (canvasW - margenX); x = x + tamanoCelda) {
		for (let y = margenY + mediaCelda; y < (canvasH - margenY); y = y + tamanoCelda) {

			let figura = {
				x: x,
				y: y,
				puntos: [],
				color: randomColor(matiz)
			};

			let xp;
			let yp;
			let distancia;

			switch (forma) {
				case 'circulo':
					nPuntos = map(xMedio - dist(x, y, xMedio, yMedio), 0, xMedio, 0, 5);
					break;

				case 'cuadrado':
					xp = x;
					yp = y;

					if (abs(x - xMedio) < abs(y - yMedio)) {
						xp = xMedio;
					} else {
						yp = yMedio;
					}

					distancia = xMedio - dist(xp, yp, xMedio, yMedio);

					nPuntos = map(distancia, 0, xMedio, 0, 5);

					break;

				case 'triangulo':
					nPuntos = 0;

					// Gracias a Daniel Arias por la ayuda trigonométrica!

					if (x <= centroTx) {
						if (sqrt(3) / 3 * (x - centroTx) + (y - centroTy) <= 0) {
							nPuntos = tercioIzquierda(x, y);
							nPuntos = map(nPuntos, 0, tercioIzquierda(centroTx, centroTy), 1, 5);
						} else {
							if (y < 3 / 2 * centroTy) {
								nPuntos = tercioAbajo(x, y);
								nPuntos = map(nPuntos, 3 / 2 * centroTy, tercioAbajo(centroTx, centroTy), 1, 5);
							}
						}
					} else {
						if (sqrt(3) / - 3 * (x - centroTx) + (y - centroTy) <= 0) {
							nPuntos = tercioDerecha(x, y);
							nPuntos = map(nPuntos, 0, tercioDerecha(centroTx, centroTy), 1, 5);
						} else {
							if (y < 3 / 2 * centroTy) {
								nPuntos = tercioAbajo(x, y);
								nPuntos = map(nPuntos, 3 / 2 * centroTy, tercioAbajo(centroTx, centroTy), 1, 5);
							}
						}
					}

					break;
			}

			nPuntos = nPuntos + random(ruido * -1, ruido);

			for (i = 0; i < nPuntos; i++) {
				figura.puntos.push(coordenada(figura.x, figura.y, tamanoCelda));
			}

			figuras.push(figura);
		}
	}

	// Dibujo de figuras

	createCanvas(canvasW, canvasH);

	function variacion(valor, minVariacion, maxVariacion) {
		return max(minVariacion, min(maxVariacion, valor + random() * 6 - 3));
	}

	function variacionesEnCoordenadas(puntos, minX, maxX, minY, maxY) {
		var nuevosPuntos = [];

		$.each(puntos, function (p, punto) {
			nuevosPuntos.push([variacion(punto[0], minX, maxX), variacion(punto[1], minY, maxY)]);
		});

		return nuevosPuntos;
	}

	let figuraCentral;

	figuraCentral = createGraphics(canvasW, canvasH);
	figuraCentral.strokeWeight(grosorLinea);

	if (forma == 'triangulo') {
		figuraCentral.translate(0, canvasH / 9);
	}

	$.each(figuras, function (f, figura) {
		if (figura.puntos.length) {
			figuraCentral.beginShape();
			figuraCentral.stroke(figura.color);

			figuraCentral.curveVertex(figura.puntos[0][0], figura.puntos[0][1]);
			$.each(figura.puntos, function (p, punto) {
				figuraCentral.curveVertex(punto[0], punto[1]);
			});
			figuraCentral.curveVertex(figura.puntos[figura.puntos.length - 1][0], figura.puntos[figura.puntos.length - 1][1]);

			figuraCentral.endShape();
		}
	});

	clear();
	background(255, 255, 255);
	image(figuraCentral, 0, 0);
	image(front, 0, 0);
}

function draw() {
	
	
}