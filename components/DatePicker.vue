<script setup lang="ts">
import { ref } from "vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const date = ref();

const format = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};
</script>

<template>
    <Datepicker
        v-model="date"
        :enableTimePicker="false"
        placeholder="Vælg dato"
        :format="format"
    ></Datepicker>
</template>
