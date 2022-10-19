<script setup lang="ts">
import { Loader } from "@googlemaps/js-api-loader";
const mapDiv = ref(null);

const props = defineProps({
    placeLat: { type: String, required: true },
    placeLng: { type: String, required: true },
    placeId: { type: String, required: true },
});
const placeLatNum = +props.placeLat;
const placeLngNum = +props.placeLng;
const myLatLng = { lat: placeLatNum, lng: placeLngNum };

let loader = new Loader({
    apiKey: "AIzaSyDZHEUaLKeeJztYBC9xiHX1ye-asu-p5t0",
    id: "__googleMapsScriptId",
    version: "weekly",
    libraries: ["places"],
    region: "dk",
});

const mapOptions = {
    center: {
        lat: placeLatNum,
        lng: placeLngNum,
    },
    zoom: 14,
};

loader
    .load()
    .then((google) => {
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
    })
    .catch((e) => {
        console.log(e);
    });

// remove google scripts after leaving af page
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
    <div ref="mapDiv" class="h-96"></div>
</template>
