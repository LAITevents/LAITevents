<script setup lang="ts">
import { Loader } from "@googlemaps/js-api-loader";

const mapDiv = ref(null);

const loader = new Loader({
    apiKey: "AIzaSyDZHEUaLKeeJztYBC9xiHX1ye-asu-p5t0",
});

const mapOptions = {
    center: {
        lat: 55.425594,
        lng: 10.391009,
    },
    zoom: 14,
};

loader
    .load()
    .then((google) => {
        new google.maps.Map(mapDiv.value, mapOptions);
    })
    .catch((e) => {
        // do something
    });
</script>

<template>
    <div ref="mapDiv" class="h-96"></div>
</template>
