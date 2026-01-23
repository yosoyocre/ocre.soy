import { DiagonalIzquierda } from "./patrones/diagonalIzquierda.js";
import { DiagonalDerecha } from "./patrones/diagonalDerecha.js";
import { Cruzado } from "./patrones/cruzado.js";
import { Puntos } from "./patrones/puntos.js";
import { PuntosOndas } from "./patrones/puntosOndas.js";
import { PuntosPerlin } from "./patrones/puntosPerlin.js";
import { Laberinto } from "./patrones/laberinto.js";
import { Angulos } from "./patrones/angulos.js";
import { Ondas } from "./patrones/ondas.js";
import { Tejas } from "./patrones/tejas.js";
import { Flechas } from "./patrones/flechas.js";
import { PuntosDiskSampling } from "./patrones/puntosDiskSampling.js";

export const patrones = [
  new DiagonalIzquierda(),
  new DiagonalDerecha(),
  new Cruzado(),
  new Puntos(),
  new PuntosOndas(),
  new PuntosPerlin(),
  new PuntosDiskSampling(),
  new Laberinto(),
  new Angulos(),
  new Ondas(),
  new Tejas(),
  new Flechas(),
];
