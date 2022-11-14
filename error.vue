<script setup lang="ts">
defineProps({
    error: Object,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
    <div class="flex flex-col items-center text-center justify-center h-screen">
        <div class="mx-auto py-10 px-4">
            <h1 class="font-bold text-2xl">{{ error.message }}</h1>

            <h1 class="text-2xl">😱</h1>
            <p class="">Denne side findes ikke.</p>

            <button
                class="text-lait-yellow font-bold cursor-pointer mt-2"
                @click="handleError()"
            >
                Tilbage til forside
            </button>
        </div>
    </div>
</template>
