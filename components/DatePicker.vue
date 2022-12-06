<script setup lang="ts">
import { ref } from "vue";
import Datepicker from "@vuepic/vue-datepicker";

const props = defineProps({
    placeholderText: String,
});

const selectedDate = ref();

const format = (selectedDate: Date) => {
    const day: Number = selectedDate.getDate();
    const month: Number = selectedDate.getMonth() + 1;
    const year: Number = selectedDate.getFullYear();

    return `${day}/${month}/${year}`;
};
</script>

<template>
    <Datepicker
        class="custom-datepicker"
        v-model="selectedDate"
        :enableTimePicker="false"
        :placeholder="props.placeholderText"
        :format="format"
        utc
    ></Datepicker>
</template>
