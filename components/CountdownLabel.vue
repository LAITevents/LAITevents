<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps({
    date: String,
});

const dateToday = new Date();
const dateTodayFormat = dayjs(dateToday);
const dateDeadline = ref(props.date);
const dateDeadlineFormat = dayjs(dateDeadline.value);

const diff = dateDeadlineFormat.diff(dateTodayFormat, "day", true);
const diffDays = Math.floor(diff);
const diffHours = Math.floor((diff - diffDays) * 24);

// change dag or dage "string"
const changeString = ref("");

const changeDayOrDays = () => {
    if (diffDays > 1) {
        changeString.value = "dage og";
    } else if (diffDays === 1) {
        changeString.value = "dag og";
    } else {
        changeString.value = "";
    }
    return changeString;
};
changeDayOrDays();

// show if more than 0 diffDays diff
const showdiffDays = ref();

const checkDiffDays = () => {
    if (diffDays > 0) {
        showdiffDays.value = diffDays;
    } else {
        showdiffDays.value = "";
    }
    return showdiffDays;
};
checkDiffDays();

// change time or timer "string"
const changeTimeOrTimer = () => {
    if (diffHours === 1) {
        return "time";
    } else {
        return "timer";
    }
};
changeTimeOrTimer();

onMounted(() => {
    changeDayOrDays(), checkDiffDays(), changeTimeOrTimer();
});
</script>

<template>
    <div
        v-if="diff > 0 && diff < 4"
        class="relative lg:bottom-14 flex justify-center items-center bg-lait-yellow h-9 w-64"
    >
        <p class="text-xs font-bold text-lait-blue">
            Tilmeldingfrist: {{ showdiffDays }} {{ changeString }}
            {{ diffHours }}
            {{ changeTimeOrTimer() }}
        </p>
    </div>
    <div
        v-else-if="dateTodayFormat >= dateDeadlineFormat"
        class="relative lg:bottom-14 flex justify-center items-center bg-lait-yellow font-bold h-9 w-64"
    >
        <p class="text-xs text-lait-blue">Tilmelding lukket</p>
    </div>
</template>
