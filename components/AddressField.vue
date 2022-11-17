<script setup lang="ts">
import { useGooglePlaces } from "~~/composable/useGooglePlaces";
import { ref } from "vue";
const { usePlacesApi } = useGooglePlaces();
const addressInput = ref(null);
const placeId = ref();
const placeLat = ref();
const placeLng = ref();

defineExpose({
    placeId,
    placeLng,
    placeLat,
});

const config = useRuntimeConfig();
declare var google: any;

onBeforeMount(() => {
    nextTick(async () => {
        await usePlacesApi(config.public.googleLink);

        var options = {
            componentRestrictions: { country: "dk" },
            fields: ["place_id", "geometry", "name"],
        };

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
            class="custom-input w-full"
            placeholder="Søg efter en adresse.."
            aria-label="Search"
            ref="addressInput"
        />
    </div>
</template>
