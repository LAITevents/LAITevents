<script setup lang="ts">
import { ref } from "vue";
import { useGooglePlaces } from "@/composable/useGooglePlaces";
const { usePlacesApi } = useGooglePlaces();
declare var google;
let autocomplete;

const addressInput = ref(null);
const placeId = ref();
const placeLat = ref();
const placeLng = ref();

defineExpose({
    placeId,
    placeLng,
    placeLat,
});

const link =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZHEUaLKeeJztYBC9xiHX1ye-asu-p5t0&libraries=places&region=dk";

onMounted(async () => {
    var options = {
        componentRestrictions: { country: "dk" },
        fields: ["place_id", "geometry", "name"],
    };

    await usePlacesApi(link);
    const autocomplete = new google.maps.places.Autocomplete(
        addressInput.value,
        options
    );

    autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace();
        placeLat.value = place.geometry.location.lat();
        placeLng.value = place.geometry.location.lng();
        placeId.value = place.place_id;
    });
});

onUnmounted(() => {
    var scripts = document.querySelectorAll(
        "script[src*='maps.googleapis.com/maps-api-v3']"
    );
    for (var i = 0; i < scripts.length; i++) {
        scripts[i].parentNode.removeChild(scripts[i]);
    }
});
</script>

<template>
    <div>
        <input
            type="search"
            class="form-control p-2 text-gray-500 focus:outline-none w-3/5"
            placeholder="Søg efter en adresse.."
            aria-label="Search"
            ref="addressInput"
        />
    </div>
</template>
