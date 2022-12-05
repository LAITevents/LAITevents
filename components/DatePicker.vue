<script setup lang="ts">
import { ref } from "vue";
import Datepicker from "@vuepic/vue-datepicker";

const props = defineProps({
    placeholderText: String,
});

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
        class="custom-datepicker"
        v-model="selectedDate"
        :enableTimePicker="false"
        :placeholder="props.placeholderText"
        :format="format"
        utc
    ></Datepicker>
</template>
