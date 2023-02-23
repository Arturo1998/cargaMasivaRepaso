<template>
  <ReadFile texto="Elige un fichero" @carga="cargaFichero" />
  <label for="progreso">Downloading progress:</label>
  <progress id="progreso" :value="fichero.length" max="100">
    {{ (progreso / fichero.length) * 100 }}
  </progress>
  <div v-if="terminado">
    <p>Terminado</p>
    <button @click="cargaEnBBDD_PromiseAll">
      Carga En Base Datos con Promise All
    </button>
    <button @click="cargaEnBBDD">Carga En Base Datos</button>
    <button @click="cargaEnBBDD_foreach">Carga En Base Datos foreach</button>
    <h1>Se han producido los siguientes errores {{ ficheroErrores.length }}</h1>
    <h1>Llevamos grabados la cantidad de {{ progreso }} usuarios</h1>
    <ul>
      <li v-for="(el, key) in ficheroErrores" :key="key">{{ el }}</li>
    </ul>
  </div>
  <h3>Tipo de persona a buscar</h3>
  <select name="" id="" v-model="listaTipo">
    <option value="Alumno">Alumno</option>
    <option value="Trabajador">Trabajador</option>
    <option value="Profesor">Profesor</option>
  </select>
  <h3>Numero de personas a buscar</h3>
  <input type="text" v-model="numeroPersonas" />
  <button @click="buscarPersonas()">Buscar</button>
  <ul v-for="(persona, index) in personasBuscadas" :key="index">
    <li>
      <MiPersona :persona="persona" />
    </li>
  </ul>
</template>

<script setup>
import ReadFile from "@/components/ReadFile.vue";
import MiPersona from "./components/MiPersona.vue";
import axios from "axios";
import { ref } from "vue";
const fichero = ref([]);
const ficheroErrores = ref([]);
const terminado = ref(false);
const progreso = ref(1);
const numeroPersonas = ref(0);
let personasBuscadas = ref([]);
let listaTipo = ref();

const buscarPersonas = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/personas?tipo=${listaTipo.value}&_limit=${numeroPersonas.value}`
    );
    personasBuscadas.value = response.data;
  } catch (e) {
    console.log(e);
  }
};

const cargaFichero = (fich) => {
  //Pasamos la cadena de caracteres del fichero obtenido a un array
  progreso.value = 1;
  fichero.value = fich.toString().trim().split("\n");
  //Hacemos tonteriítas innecesarias con el progreso
  progreso.value = 50;
  terminado.value = true;
  //Ahora pasamos el fichero de csv a JSON'
  const cabecera = fichero.value[0].split(",");
  fichero.value.shift(); //Eliminamos la cabecera
  fichero.value = fichero.value.map(
    (el) =>
      el
        .split(",")
        .map((el2, idx2) => [cabecera[idx2], el2]) //Creamos un par clave valor
        .map((el2) => {
          let obj = {};
          obj[el2[0]] = el2[1];
          return obj;
        }) //Creamos un objeto con cada clave valor
        .reduce((ac, el) => {
          return { ...ac, ...el };
        }, {}) //Reducidmos para crear el array de previos a Json
  );
  progreso.value = 100;
}; //Fin de CargaFichero

const cargaEnBBDD_PromiseAll = async () => {
  //const headers = {"Access-Control-Allow-Origin" : "http://localhost:3000"}
  progreso.value = 1;
  await Promise.all(
    fichero.value.map(async (el) => {
      try {
        const res = await axios.post("http://localhost:3000/personas", el); //,{headers})
        progreso.value++;
      } catch (error) {
        ficheroErrores.value.push(el);
      }
    })
  );
}; //Fin cargaEnBBDD_Promise_all

const cargaEnBBDD = () => {
  const headers = { "Access-Control-Allow-Origin": "http://localhost:3000" };
  progreso.value = 1;

  fichero.value.map(async (el) => {
    try {
      const res = await axios.post("http://localhost:3000/personas", el, {
        headers,
      });
      progreso.value++;
    } catch (error) {
      ficheroErrores.value.push(el);
    }
  });
}; //FincargaEnBBDD
const cargaEnBBDD_foreach = () => {
  const headers = { "Access-Control-Allow-Origin": "http://localhost:3000" };
  progreso.value = 1;

  fichero.value.forEach(async (el) => {
    try {
      const res = await axios.post("http://localhost:3000/personas", el, {
        headers,
      });
      progreso.value++;
    } catch (error) {
      ficheroErrores.value.push(el);
    }
  });
}; //FincargaEnBBDD
</script>

<style scoped></style>
