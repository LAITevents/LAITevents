<script setup lang="ts">
import { ref } from "vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const selectedDate = ref();

const format = (selectedDate) => {
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    return `${day}/${month}/${year}`;
};
</script>

<template>
    <Datepicker
        v-model="selectedDate"
        :enableTimePicker="false"
        placeholder="Vælg dato"
        :format="format"
        utc
    ></Datepicker>
</template>
