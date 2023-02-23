<template>
  {{ props.persona.nombre }}
  <input type="checkbox" v-model="checkbox" />
</template>

<script setup>


const props = defineProps({
  persona: Object,
});


</script>

<style scoped></style>
