<script setup lang="ts">
import { ref } from "vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const time = ref({
    hours: new Date(),
    minutes: new Date(),
});
</script>

<template>
    <Datepicker
        v-model="time"
        timePicker
        hideInputIcon
        inputClassName=""
        placeholder="Vælg tidspunkt"
    />
</template>
