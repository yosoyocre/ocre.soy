const sucio = (canvasW, canvasH, coverType, matizGlobal, textoCreditos) => ( sketch ) => {

	let front;
	let back;

	sketch.preload = () => {
		front = sketch.loadImage('front_outlined_0.png');
		back = sketch.loadImage('back.png?v=3');
	}

	sketch.setup = () => {

		let tamanoCelda = canvasW / 70;		

		let mediaCelda = tamanoCelda / 2;
		let xMedio = canvasW / 2;
		let yMedio = canvasH / 2;

		let centroTx = canvasW / 2;
		let centroTy = canvasH / 2;
		let margenX = (canvasW - sketch.floor(canvasW / tamanoCelda) * tamanoCelda) / 2;
		let margenY = (canvasH - sketch.floor(canvasH / tamanoCelda) * tamanoCelda) / 2;

		let formas = ['circulo', 'cuadrado', 'triangulo'];

		let conTrazoFijo = sketch.round(sketch.random(0,1));
		let matiz = !!matizGlobal ? matizGlobal : sketch.round(sketch.random(0, 255));

		// Cálculo de figuras

		function tercioIzquierda(x, y) {
			return sketch.sqrt(3) * (x - centroTx) + y;
		}

		function tercioDerecha(x, y) {
			return -1 * sketch.sqrt(3) * (x - centroTx) + y;
		}

		function tercioAbajo(x, y) {
			return y;
		}

		// Colores

		function randomColor(h) {
			let s = sketch.round(sketch.random(30, 100));
			let l = sketch.round(sketch.random(0, 100));
			
			let rColor = sketch.color('hsl(' + h + ', ' + s + '%, ' + l + '%)');

			return rColor;
		}

		// Dibujo de trazos

		function coordenada(x, y, tamano) {
			return [
				sketch.round(x - tamano / 2 + tamano * sketch.random()),
				sketch.round(y - tamano / 2 + tamano * sketch.random())
			];
		}

		function fecha(date) {
			function pad(n) { return n < 10 ? '0' + n : n; }
	  
			return 'el ' +
				pad(date.getDate()) + '/' +
				pad(date.getMonth() + 1) + '/' +
				pad(date.getFullYear()) + ' a las ' +
				pad(date.getHours()) + ':' +
				pad(date.getMinutes());
		}

		// Construcción de figuras

		function crearFigura() {

			let conRuido = sketch.round(sketch.random(0,1));
			let trazoFijo = sketch.round(sketch.random(4,6));
			let ruido = 0.8;
			let forma = coverType == 'back' ? 'circulo' : sketch.random(formas);
			let figuras = [];
			
			if (conTrazoFijo && !conRuido) {
				ruido = 0;
			} else if (forma == 'triangulo') {
				ruido = 1;
			}

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
							nPuntos = sketch.map(xMedio - sketch.dist(x, y, xMedio, yMedio), 0, xMedio, 0, 5);
							break;

						case 'cuadrado':
							xp = x;
							yp = y;

							if (sketch.abs(x - xMedio) < sketch.abs(y - yMedio)) {
								xp = xMedio;
							} else {
								yp = yMedio;
							}

							distancia = xMedio - sketch.dist(xp, yp, xMedio, yMedio);

							nPuntos = sketch.map(distancia, 0, xMedio, 0, 5);

							break;

						case 'triangulo':
							nPuntos = 0;

							// Gracias a Daniel Arias por la ayuda trigonométrica!

							// Teniendo en cuenta que hay cierto nivel de rudio,
							// ajusto la posición vertical a ojo

							yp = y - canvasH / 9;


							if (x <= centroTx) {
								if (sketch.sqrt(3) / 3 * (x - centroTx) + (yp - centroTy) <= 0) {
									nPuntos = tercioIzquierda(x, yp);
									nPuntos = sketch.map(nPuntos, 0, tercioIzquierda(centroTx, centroTy), 1, 5);
								} 
								else {
									if (yp < 3 / 2 * centroTy) {
										nPuntos = tercioAbajo(x, yp);
										nPuntos = sketch.map(nPuntos, 3 / 2 * centroTy, tercioAbajo(centroTx, centroTy), 1, 5);
									}
								}
							} 
							else {
								if (sketch.sqrt(3) / - 3 * (x - centroTx) + (yp - centroTy) <= 0) {
									nPuntos = tercioDerecha(x, yp);
									nPuntos = sketch.map(nPuntos, 0, tercioDerecha(centroTx, centroTy), 1, 5);
								} else {
									if (yp < 3 / 2 * centroTy) {
										nPuntos = tercioAbajo(x, yp);
										nPuntos = sketch.map(nPuntos, 3 / 2 * centroTy, tercioAbajo(centroTx, centroTy), 1, 5);
									}
								}
							}

							break;
					}

					nPuntos = nPuntos + sketch.random(ruido * -1, ruido);

					for (i = 0; i < nPuntos; i++) {
						figura.puntos.push(coordenada(figura.x, figura.y, tamanoCelda));
					}

					figuras.push(figura);
				}
			}

			let figuraCentral;
			
			figuraCentral = sketch.createGraphics(canvasW, canvasH);
	
			$.each(figuras, function (f, figura) {
				if (figura.puntos.length >= 2) {
					figuraCentral.beginShape();
					figuraCentral.stroke(figura.color);
					
					if (!conTrazoFijo && figura.puntos.length == 2) {
						figuraCentral.strokeWeight(8);
						figuraCentral.point(figura.puntos[0][0], figura.puntos[0][1]);
					} else {
						figuraCentral.strokeWeight(sketch.map(conTrazoFijo ? trazoFijo : figura.puntos.length, 2, 5, canvasW / 700, canvasH / 175));
						figuraCentral.curveVertex(figura.puntos[0][0], figura.puntos[0][1]);
						$.each(figura.puntos, function (p, punto) {
							figuraCentral.curveVertex(punto[0], punto[1]);
						});
						figuraCentral.curveVertex(figura.puntos[figura.puntos.length - 1][0], figura.puntos[figura.puntos.length - 1][1]);
					}
	
					figuraCentral.endShape();
				}
			});

			return figuraCentral;
		}

		// Dibujo de figuras

		sketch.createCanvas(canvasW, canvasH);

		sketch.clear();
		sketch.background(255, 255, 255);
		sketch.push();

		switch (coverType) {
			case 'front':
				sketch.image(crearFigura(), 0, 0);
				break;

			case 'back':
				let miniW = 252;
				let miniMargen = 30;
				sketch.image(crearFigura(), canvasW - miniW - miniMargen, miniMargen, miniW, miniW);
				sketch.image(crearFigura(), miniMargen, canvasW - miniW - miniMargen, miniW, miniW);
				break;

			default:
				sketch.image(crearFigura(), 0, 0);
				break;
		}

		sketch.pop();
		sketch.noStroke();

		switch (coverType) {
			case 'front':
				sketch.image(front, 0, 0);
				break;

			case 'back':
				sketch.image(back, 0, 0);
				let text = '';
				
				if (!!textoCreditos) {
					text = textoCreditos + ', ';
				}
		  
				text = text + fecha(new Date());

				sketch.textSize(20);
				sketch.textFont('monospace');
				sketch.textAlign(sketch.RIGHT);
				sketch.fill(200, 200, 200);
				sketch.text(text, 19 * 70, 19 * 70);
				break;
		}
	}

	sketch.draw = () => {		
		
	}
}