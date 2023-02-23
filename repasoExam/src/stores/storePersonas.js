import { ref } from "vue";
import { defineStore } from "pinia";

export const usePersonasStore = defineStore("persona", () => {
  const listaPersonas = ref([]);

  return { listaPersonas };
});
