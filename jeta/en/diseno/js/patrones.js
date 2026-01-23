import { Angulos } from "./patrones/angulos.js";
import { Cruzado } from "./patrones/cruzado.js";
import { DiagonalDerecha } from "./patrones/diagonalDerecha.js";
import { DiagonalIzquierda } from "./patrones/diagonalIzquierda.js";
import { Flechas } from "./patrones/flechas.js";
import { Laberinto } from "./patrones/laberinto.js";
import { LineasDiskSampling } from "./patrones/lineasDiskSampling.js";
import { LineasOndulantes } from "./patrones/lineasOndulantes.js";
import { Ondas } from "./patrones/ondas.js";
import { Puntos } from "./patrones/puntos.js";
import { PuntosDiskSampling } from "./patrones/puntosDiskSampling.js";
import { PuntosOndas } from "./patrones/puntosOndas.js";
import { PuntosPerlin } from "./patrones/puntosPerlin.js";
import { Ruido } from "./patrones/ruido.js";
import { Tejas } from "./patrones/tejas.js";

export const patrones = [
  new Angulos(),
  new Cruzado(),
  new DiagonalDerecha(),
  new DiagonalIzquierda(),
  new Flechas(),
  new Laberinto(),
  new LineasDiskSampling(),
  new LineasOndulantes(),
  new Ondas(),
  new Puntos(),
  new PuntosDiskSampling(),
  new PuntosOndas(),
  new PuntosPerlin(),
  new Ruido(),
  new Tejas(),
];
