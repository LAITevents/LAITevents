<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps({
    date: String,
});

const deadlineDate = ref(props.date);

const today = new Date();
const date1 = dayjs(today);

const date2 = dayjs(deadlineDate.value);

const diff = date2.diff(date1, "day", true);
const days = Math.floor(diff);
const hours = Math.floor((diff - days) * 24);

// change dag or dage "string"

const changeString = ref("");

const changeDayOrDays = () => {
    if (days > 1) {
        changeString.value = "dage og";
    } else if (days === 1) {
        changeString.value = "dag og";
    } else {
        changeString.value = "";
    }
    return changeString;
};
changeDayOrDays();

// show if more than 0 days diff
const showDays = ref();

const checkDays = () => {
    if (days > 0) {
        showDays.value = days;
    } else {
        showDays.value = "";
    }
    return showDays;
};
checkDays();

// change time or timer "string"
const changeTimeOrTimer = () => {
    if (hours === 1) {
        return "time";
    } else {
        return "timer";
    }
};
changeTimeOrTimer();
</script>

<template>
    <div
        v-if="diff > 0 && diff < 4"
        class="relative bottom-2 flex justify-center items-center bg-lait-yellow h-9 w-64"
    >
        <p class="text-xs font-bold text-lait-blue">
            Tilmeldingfrist: {{ showDays }} {{ changeString }}
            {{ hours }}
            {{ changeTimeOrTimer() }}
        </p>
    </div>
    <div
        v-else-if="date1 >= date2"
        class="relative bottom-2 flex justify-center items-center bg-lait-yellow font-bold h-9 w-64"
    >
        <p class="text-xs text-lait-blue">Tilmelding lukket</p>
    </div>
</template>
