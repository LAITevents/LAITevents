<script setup lang="ts">
useHead({
    script: [
        {
            src: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZHEUaLKeeJztYBC9xiHX1ye-asu-p5t0&libraries=places&region=dk",
            async: true,
            defer: true,
        },
    ],
});
</script>

<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
