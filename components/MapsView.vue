<script setup lang="ts">
import { useGooglePlaces } from "~~/composable/useGooglePlaces";
const { usePlacesApi } = useGooglePlaces();
declare var google: any;

const props = defineProps({
    placeLat: { type: String, required: true },
    placeLng: { type: String, required: true },
    placeId: { type: String, required: true },
});

// Set options and location for map
const placeLatNum = +props.placeLat;
const placeLngNum = +props.placeLng;
const myLatLng = { lat: placeLatNum, lng: placeLngNum };

const mapOptions = {
    center: {
        lat: placeLatNum,
        lng: placeLngNum,
    },
    zoom: 14,
};

// init google maps with placeserivce to get info on location
const mapDiv = ref(null);
const placeTitel = ref("");
const config = useRuntimeConfig();
async function initMap() {
    await usePlacesApi(config.public.googleLink);
    const map = new google.maps.Map(mapDiv.value, mapOptions);

    const request = {
        placeId: props.placeId,
        fields: ["name", "formatted_address", "place_id", "geometry"],
    };

    const infowindow = new google.maps.InfoWindow();
    const service = new google.maps.places.PlacesService(map);

    service.getDetails(request, (place, status) => {
        if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.geometry &&
            place.geometry.location
        ) {
            const marker = new google.maps.Marker({
                position: myLatLng,
                map,
            });

            const content = document.createElement("div");
            content.style.color = "black";

            const nameElement = document.createElement("h2");
            nameElement.textContent = place.name!;
            content.appendChild(nameElement);
            placeTitel.value = place.name;

            const placeAddressElement = document.createElement("p");
            placeAddressElement.textContent = place.formatted_address!;
            content.appendChild(placeAddressElement);
            infowindow.setContent(content);
            infowindow.open(map, marker);

            google.maps.event.addListener(marker, "click", () => {
                infowindow.setContent(content);
                infowindow.open(map, marker);
            });
        }
    });
}

onMounted(() => {
    initMap();
});
</script>

<template>
    <div class="flex gap-2 mb-4">
        <Icon size="24" name="ic:baseline-location-on" />
        <p>{{ placeTitel }}</p>
    </div>
    <div ref="mapDiv" class="h-96"></div>
</template>
