<script setup lang="ts">
import { ref } from "vue";
import { useDateFormatter } from "@/composable/useDateFormatter";
import { useCategories } from "@/composable/useCategories";
import { useDashify } from "@/composable/dashify";
import { useSlack } from "@/composable/useSlack";

const { dashify } = useDashify();
const { formatDeadlineDate } = useDateFormatter();
const { postEventOnSlack } = useSlack();
const { getCategoriesFromDb } = useCategories();
const supabase = useSupabaseClient();
const user = supabase.auth.user();

const statusMsg = ref("");
const errorMsg = ref("");

// Format selectedDate to use UTC and add value from timepicker
const selectedDate = ref();
const selectedTime = ref();

const newDateTime = () => {
    const newDate = new Date(selectedDate.value);
    const offset = newDate.getTimezoneOffset() / 60;
    newDate.setUTCHours(selectedTime.value.hours + offset);
    newDate.setUTCMinutes(selectedTime.value.minutes);
    return newDate;
};

// Generate filepath for image
const imagePath = ref("");

async function setCurrentFile(filePath: any, file: any) {
    src.value = URL.createObjectURL(file);
    const { data } = await supabase.storage
        .from("images")
        .getPublicUrl("events/" + filePath);

    imagePath.value = data.publicURL;
}

// Upload image to supabase
const uploading = ref(false);
const files = ref();
const src = ref("");

const uploadImage = async (evt: any) => {
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
    } catch (error: any) {
        alert(error.message);
    } finally {
        uploading.value = false;
    }
};

// Create event
const showEventPageButton = ref(false);
const eventId = ref();
const eventTitle = ref("");
const titleOnCreatedEvent = ref("");
const eventDescription = ref("");
const selectedDeadline = ref();
const placeInfo = ref();
const eventDepartment = ref(null);
const categoryForEvent = ref("");

const addEvent = async () => {
    try {
        const { error } = await supabase.from("events").insert([
            {
                title: eventTitle.value,
                description: eventDescription.value,
                userId: user.id,
                img_url: imagePath.value,
                selected_date: newDateTime(),
                deadline_date: formatDeadlineDate(selectedDeadline.value),
                place_id: placeInfo.value.placeId,
                place_lat: placeInfo.value.placeLat,
                place_lng: placeInfo.value.placeLng,
                category_id: categoryForEvent.value,
            },
        ]);
        if (error) throw error;
        await postEventOnSlack(
            eventTitle.value,
            eventDescription.value,
            selectedDeadline.value
        );
        statusMsg.value = "Success: Event oprettet";
        eventTitle.value = null;
        eventDescription.value = null;
        setTimeout(() => {
            statusMsg.value = "";
        }, 5000);
    } catch (error: any) {
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {
            errorMsg.value = "";
        }, 5000);
    }
    showEventPageButton.value = true;
    getCreatedEvent();
};

// Get created event
const createdEvent = ref({});

const getCreatedEvent = async () => {
    try {
        const { data: createdEvent, error } = await supabase
            .from("events")
            .select("id, title")
            .order("id", { ascending: false });
        if (error) throw error;
        if (createdEvent) {
            eventId.value = createdEvent[0].id;
            titleOnCreatedEvent.value = createdEvent[0].title;
        }
    } catch (error: any) {
        console.log(error.message);
    }
};

// Get categories
const categories = ref([]);

const getCategoriesForSelect = async () => {
    categories.value = await getCategoriesFromDb();
};

onMounted(() => {
    getCategoriesForSelect();
});

definePageMeta({
    middleware: "auth",
});
</script>

<template>
    <div>
        <ErrorMessage :statusMsg="statusMsg" :errorMsg="errorMsg" />

        <div class="grid grid-cols-12 gap-5">
            <h1
                class="text-3xl font-medium lg:col-start-2 col-span-10 lg:col-span-3"
            >
                Opret event
            </h1>

            <div
                class="col-span-11 md:col-span-5 lg:col-span-3 md:col-start-2 lg:col-start-2"
            >
                <div>
                    <label for="single">
                        <div class="w-full h-auto">
                            <nuxt-img
                                v-if="src"
                                :src="src"
                                class="object-fill"
                            />
                            <svg
                                v-else
                                viewBox="0 0 310 300"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="2.5"
                                    y="2.5"
                                    width="304.926"
                                    height="295"
                                    stroke="#4C757F"
                                    stroke-width="3"
                                    stroke-dasharray="10 10"
                                />
                                <path
                                    d="M216.176 159.151V186.874C216.176 194.435 209.905 200.735 202.378 200.735H107.548C100.022 200.735 93.75 194.435 93.75 186.874V159.151C93.75 157.135 95.5061 155.371 97.5131 155.371C99.5201 155.371 101.276 157.135 101.276 159.151V186.874C101.276 190.402 104.036 193.174 107.548 193.174H202.378C205.891 193.174 208.65 190.402 208.65 186.874V159.151C208.65 157.135 210.406 155.371 212.413 155.371C214.42 155.371 216.176 156.883 216.176 159.151ZM162.24 101.186C160.233 99.1697 157.473 98.1616 154.965 98.1616C152.456 98.1616 149.696 99.1697 147.689 101.186L130.128 118.828C128.623 120.34 128.623 122.608 130.128 124.12C131.633 125.632 133.891 125.632 135.397 124.12L151.202 108.243V169.99C151.202 172.006 152.958 173.77 154.965 173.77C156.972 173.77 158.728 172.006 158.728 169.99V108.496L174.533 124.373C176.038 125.886 178.296 125.886 179.801 124.373C181.306 122.861 181.306 120.593 179.801 119.081L162.24 101.186Z"
                                    fill="#D9D9D9"
                                />
                            </svg>
                        </div>
                    </label>
                    <div>
                        <input
                            class="file:bg-lait-blue file:text-lait-yellow file:font-bold file:text file:border-none w-full"
                            type="file"
                            id="single"
                            accept="image/*"
                            @change="uploadImage"
                            :disabled="uploading"
                        />
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-6 lg:col-span-5">
                <form @submit.prevent="addEvent">
                    <div class="flex flex-col">
                        <input
                            placeholder="Titel"
                            type="text"
                            required
                            class="custom-input custom-input-focus"
                            id="event-name"
                            v-model="eventTitle"
                        />
                    </div>

                    <div
                        class="flex flex-col gap-4 md:flex-col lg:flex-row lg:justify-between"
                    >
                        <div class="w-full">
                            <DatePicker
                                v-model="selectedDate"
                                :placeholderText="'Vælg dato'"
                                required
                            />
                        </div>
                        <div class="w-full">
                            <TimePicker v-model="selectedTime" required />
                        </div>
                        <div class="w-full">
                            <DatePicker
                                v-model="selectedDeadline"
                                :placeholderText="'Deadline dato'"
                                required
                            />
                        </div>
                    </div>

                    <div
                        class="flex flex-col lg:gap-4 md:flex-col lg:flex-row mt-4"
                    >
                        <div class="flex flex-col w-full">
                            <select
                                v-model="categoryForEvent"
                                class="custom-select invalid:text-gray-200 custom-input-focus"
                                required
                            >
                                <option
                                    value=""
                                    disabled
                                    selected
                                    class="opacity-50 text-gray-400"
                                >
                                    Kategori
                                </option>
                                <option
                                    v-for="category in categories"
                                    :key="category.id"
                                    :value="category.id"
                                >
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="w-full">
                        <AddressField ref="placeInfo" />
                    </div>

                    <div class="flex flex-col">
                        <textarea
                            placeholder="Din Beskrivelse..."
                            type="text"
                            required
                            class="custom-input h-32 custom-input-focus"
                            id="event-description"
                            v-model="eventDescription"
                        />
                    </div>

                    <div class="flex flex-col items-end">
                        <button
                            class="uppercase cursor-pointer text-lait-yellow font-bold text-base"
                            type="submit"
                        >
                            opret event
                        </button>

                        <NuxtLink
                            class="cursor-pointer mb-10 text-lait-yellow uppercase font-bold text-base"
                            :to="{
                                path: `/events/${dashify(
                                    titleOnCreatedEvent
                                )}/${eventId}`,
                            }"
                            v-if="showEventPageButton"
                        >
                            Gå til Event
                        </NuxtLink>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
