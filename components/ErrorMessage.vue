<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
    errorMsg: String,
    statusMsg: String,
});
</script>

<template>
    <div
        v-if="props.statusMsg || props.errorMsg"
        class="absolute text-center left-0 right-0 -translate-y-20 mb-5 p-4 bg-light-grey"
    >
        <p>
            {{ props.statusMsg }}
        </p>
        <p class="text-lait-yellow text-center font-bold">
            {{ props.errorMsg }}
        </p>
    </div>
</template>
