<script setup lang="ts">
definePageMeta({
    middleware: "auth",
});

import { ref } from "vue";

const supabase = useSupabaseClient();
const user = supabase.auth.user();
const statusMsg = ref(null);
const errorMsg = ref(null);
const eventTitle = ref("");
const eventDescription = ref("");

const uploading = ref(false);
const files = ref();
const src = ref("");
const imagePath = ref("");

const selectedDate = ref();
const selectedTime = ref();
const placeInfo = ref();
const teams = ref([]);
const categories = ref([]);
const eventDepartment = ref(null);
const categoryForEvent = ref("");

// Format selectedDate to use UTC and add value from timepicker
const newDateTime = () => {
    const newDate = new Date(selectedDate.value);
    const offset = newDate.getTimezoneOffset() / 60;
    newDate.setUTCHours(selectedTime.value.hours + offset);
    newDate.setUTCMinutes(selectedTime.value.minutes);
    return newDate;
};

// Generate filepath
async function setCurrentFile(filePath, file) {
    src.value = URL.createObjectURL(file);

    const { data } = await supabase.storage
        .from("images")
        .getPublicUrl("events/" + filePath);

    imagePath.value = data.publicURL;
}

// Upload image
const uploadImage = async (evt) => {
    files.value = evt.target.files;
    try {
        uploading.value = true;
        if (!files.value || files.value.length === 0) {
            throw new Error("You must select an image to upload.");
        }
        const file = files.value[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload("events/" + filePath, file);
        if (uploadError) throw uploadError;

        setCurrentFile(filePath, file);
    } catch (error) {
        alert(error.message);
    } finally {
        uploading.value = false;
    }
};

// Create event
const addEvent = async () => {
    try {
        const { error } = await supabase.from("events").insert([
            {
                title: eventTitle.value,
                description: eventDescription.value,
                userId: user.id,
                img_url: imagePath.value,
                selected_date: newDateTime(),
                place_id: placeInfo.value.placeId,
                place_lat: placeInfo.value.placeLat,
                place_lng: placeInfo.value.placeLng,
                team_id: eventDepartment.value,
                category_id: categoryForEvent.value,
            },
        ]);
        if (error) throw error;
        statusMsg.value = "Success: Event oprettet";
        eventTitle.value = null;
        eventDescription.value = null;
        setTimeout(() => {
            statusMsg.value = false;
        }, 5000);
    } catch (error) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
            errorMsg.value = false;
        }, 5000);
    }
};

// Get teams
const getTeams = async () => {
    try {
        const { data, error } = await supabase.from("teams").select("*");
        if (error) throw error;
        teams.value = data;
    } catch (error) {
        console.warn(error.message);
    }
};
getTeams();

// Get categories
const getCategories = async () => {
    try {
        const { data, error } = await supabase.from("categories").select("*");
        if (error) throw error;
        categories.value = data;
    } catch (error) {
        console.warn(error.message);
    }
};
getCategories();
</script>

<template>
    <div class="mx-auto mt-8 p-8 flex flex-col rounded-md shadow-lg container">
        <!-- Status Message -->
        <div
            v-if="statusMsg || errorMsg"
            class="mb-10 p-4 bg-light-grey rounded-md shadow-lg"
        >
            <p class="">
                {{ statusMsg }}
            </p>
            <p class="text-red-500">{{ errorMsg }}</p>
        </div>
        <h1 class="text-2xl">Opret event</h1>

        <form @submit.prevent="addEvent" class="flex flex-col gap-y-5 w-full">
            <div>
                <img
                    v-if="src"
                    :src="src"
                    class="w-40 h-auto object-fill rounded"
                />

                <div style="width: 10em; position: relative">
                    <label class="block button primary" for="single">
                        {{ uploading ? "Uploading ..." : "Upload" }}
                    </label>
                    <input
                        style=""
                        type="file"
                        id="single"
                        accept="image/*"
                        @change="uploadImage"
                        :disabled="uploading"
                    />
                </div>
            </div>

            <div class="flex flex-col">
                <label for="event-name" class="mb-1">Titel</label>
                <input
                    type="text"
                    required
                    class="form-control p-2 text-gray-500 focus:outline-none"
                    id="event-name"
                    v-model="eventTitle"
                />
            </div>

            <div class="flex flex-col">
                <label for="event-description" class="mb-1">Beskrivelse</label>

                <input
                    type="text"
                    required
                    class="form-control p-2 text-gray-500 focus:outline-none"
                    id="event-description"
                    v-model="eventDescription"
                />
            </div>
            <div class="flex flex-row gap-4">
                <div>
                    <label class="mb-1">Vælg dato</label>
                    <DatePicker v-model="selectedDate" />
                </div>
                <div>
                    <label class="mb-1">Vælg tidspunkt</label>
                    <TimePicker v-model="selectedTime" />
                </div>
            </div>

            <AddressField ref="placeInfo" />

            <div class="">
                <select
                    v-model="eventDepartment"
                    class="form-control p-2 text-gray-500 focus:outline-none"
                >
                    <option
                        v-for="team in teams"
                        :key="team.id"
                        :value="team.id"
                    >
                        {{ team.team_title }}
                    </option>
                </select>
            </div>

            <div class="flex flex-col">
                <label class="mb-1">Kategori</label>
                <select
                    v-model="categoryForEvent"
                    class="form-control p-2 text-gray-500 focus:outline-none w-40"
                >
                    <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                    >
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <button
                type="submit"
                class="p-2 font-medium bg-blue-500 hover:bg-blue-700 rounded"
            >
                Opret Event
            </button>
        </form>
    </div>
</template>
