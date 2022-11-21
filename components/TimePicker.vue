<script setup lang="ts">
import { ref } from "vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const selectedTime = ref({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
});
</script>

<template>
    <Datepicker
        class="custom-datepicker"
        v-model="selectedTime"
        timePicker
        hideInputIcon
        inputClassName=""
        placeholder="Vælg tidspunkt"
        utc
    />
</template>
