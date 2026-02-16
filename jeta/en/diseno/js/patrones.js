import { Angulos } from "./patrones/angulos.js";
import { Azulejos } from "./patrones/azulejos.js";
import { Azulejos2 } from "./patrones/azulejos2.js";
import { Azulejos3 } from "./patrones/azulejos3.js";
import { Azulejos4 } from "./patrones/azulejos4.js";
import { AzulejosFlores } from "./patrones/azulejosFlores.js";
import { AzulejosFlores2 } from "./patrones/azulejosFlores2.js";
import { CirculosTachados } from "./patrones/circulosTachados.js";
import { Cruzado } from "./patrones/cruzado.js";
import { CuadradosConcentricos } from "./patrones/cuadradosConcentricos.js";
import { CuadradosConcentricosGirados } from "./patrones/cuadradosConcentricosGirados.js";
import { DiagonalDerecha } from "./patrones/diagonalDerecha.js";
import { DiagonalIzquierda } from "./patrones/diagonalIzquierda.js";
import { Flechas } from "./patrones/flechas.js";
import { Ladrillos } from "./patrones/ladrillos.js";
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
  new Azulejos(),
  new Azulejos2(),
  new Azulejos3(),
  new Azulejos4(),
  new AzulejosFlores(),
  new AzulejosFlores2(),
  new CirculosTachados(),
  new Cruzado(),
  new CuadradosConcentricos(),
  new CuadradosConcentricosGirados(),
  new DiagonalDerecha(),
  new DiagonalIzquierda(),
  new Flechas(),
  new Ladrillos(),
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
