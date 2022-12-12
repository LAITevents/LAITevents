<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDateFormatter } from "@/composable/useDateFormatter";
import { useUser } from "@/composable/useUser";
import { useRegistration } from "@/composable/useRegistration";
const { formatDate, formatTime } = useDateFormatter();
const { registerEvent, deleteUserRegistration } = useRegistration();
const { getUsername } = useUser();

const route = useRoute();
const supabase = useSupabaseClient();
const user = supabase.auth.user();

const statusMsg = ref(null);
const errorMsg = ref(null);

// Gets event data from supabase
const data = ref();
const currentId: any = route.params.id;
const dataLoaded = ref(null);

const getEventForRouteId = async () => {
    try {
        const { data: events, error } = await supabase
            .from("events")
            .select("*, event_participants(*), comments(*), category_id(*)")
            .eq("id", currentId);

        if (error) throw error;
        dataLoaded.value = true;
        data.value = events[0];
    } catch (error: any) {
        errorMsg.value = error.message;
        setTimeout(() => {
            errorMsg.value = false;
        }, 5000);
    }
};

// Gets participants for the specific event id
const eventParticipants = ref([]);
const registered = ref(false);

const getParticipants = async () => {
    eventParticipants.value = [];
    try {
        const { data: participants, error } = await supabase
            .from("event_participants")
            .select("*")
            .eq("event_id", currentId);
        if (error) throw error;
        participants.forEach(async (participant) => {
            const userDetails = await getUsername(participant?.user_id);
            eventParticipants.value.push(userDetails);
            if (participant.user_id === user.id) {
                registered.value = true;
            }
        });
    } catch (error: any) {
        errorMsg.value = error.message;
        setTimeout(() => {
            errorMsg.value = false;
        }, 5000);
    }
};

// Register an event
const registerCurrentEvent = async () => {
    if (registered.value) return;
    await registerEvent(currentId, user.id);
    registered.value = true;
    getParticipants();
};

// Cancel event registration
const cancelRegistration = async () => {
    await deleteUserRegistration(currentId, user.id);
    registered.value = false;
    getParticipants();
};

// Read more button
const hideText = ref(true);

const eventDescription = () => {
    const description: string = data.value.description;
    if (data.value.description.length < 250) {
        return description;
    } else if (hideText.value) {
        return `${description.slice(0, 250)}...`;
    }
    return description;
};

// Save view to localstorage
const logEventView = () => {
    let storedArray = JSON.parse(localStorage.getItem("viewedEvents"));
    let objArray = {
        eventId: currentId,
        viewed_at: new Date().getTime(),
    };

    if (storedArray === null) {
        storedArray = [];
    }

    // find the index in array where id' match
    let objIndex = storedArray.findIndex(
        (obj: any) => obj.eventId == currentId
    );

    if (objIndex >= 0) {
        storedArray[objIndex].viewed_at = new Date().getTime();
        localStorage.setItem("viewedEvents", JSON.stringify(storedArray));
    } else {
        storedArray.push(objArray);
        localStorage.setItem("viewedEvents", JSON.stringify(storedArray));
    }
};

onMounted(() => {
    getEventForRouteId();
    getParticipants();
    logEventView();
});

definePageMeta({
    middleware: "auth",
});
</script>

<template>
    <div>
        <div v-if="dataLoaded" class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div
                class="col-span-12 lg:col-start-2 lg:col-span-5 lg:translate-y-16"
            >
                <div class="mb-14">
                    <p
                        class="flex flex-end lg:justify-end items-end text-lait-yellow text-xs mb-1 font-bold"
                    >
                        {{ data.category_id.name }}
                    </p>
                    <nuxt-img
                        v-if="data.img_url"
                        :src="data.img_url"
                        class="w-full h-60 md:h-72 lg:w-full lg:h-96 object-cover"
                    />
                    <h1 class="font-medium text-2xl mt-4 mb-3">
                        {{ data.title }}
                    </h1>
                    <div class="flex flex-col items-start gap-3">
                        <p>
                            {{ eventDescription() }}
                        </p>

                        <button
                            v-if="data.description.length > 249"
                            @click="hideText = !hideText"
                            class="text-lait-yellow uppercase font-bold text-xs"
                        >
                            Læs {{ hideText ? "Mere" : "Mindre" }}
                        </button>
                    </div>
                </div>
                <div>
                    <h3 class="font-medium text-2xl mb-3">
                        Deltagere
                        <span class="text-lait-yellow text-2xl"
                            >({{ eventParticipants.length }})</span
                        >
                    </h3>
                    <div class="flex flex-wrap gap-4 lg:col-span-5 mb-20">
                        <template
                            v-for="participant in eventParticipants"
                            :key="participant"
                        >
                            <div class="flex bg-light-blue max-h-10 flex-row">
                                <ProfileAvatar
                                    :showUpload="false"
                                    v-model:path="participant.avatar_url"
                                    class="custom-image-resize"
                                />
                                <p class="px-4 py-2">
                                    {{ participant.username }}
                                </p>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="lg:col-start-8 col-span-12 lg:col-span-4">
                <div class="p-7 bg-light-blue">
                    <div class="flex gap-2 capitalize">
                        <Icon size="24" name="ic:baseline-calendar-month" />

                        {{ formatDate(data.selected_date) }}
                    </div>
                    <div class="flex gap-2 capitalize my-2">
                        <Icon size="24" name="ic:baseline-access-time" />

                        Kl: {{ formatTime(data.selected_date) }}
                    </div>

                    <MapsView
                        v-if="data.place_lat && data.place_lng && data.place_id"
                        :placeLat="data.place_lat"
                        :placeLng="data.place_lng"
                        :placeId="data.place_id"
                    />

                    <h3 class="text-center font-medium mt-4">
                        Sidste chance for tilmelding:
                        <span class="capitalize text-lait-yellow">{{
                            formatDate(data.deadline_date)
                        }}</span>
                    </h3>

                    <div class="text-lait-yellow text-center">
                        <button
                            v-if="!registered"
                            @click="registerCurrentEvent()"
                            class="uppercase border-lait-yellow border-2 font-medium px-4 py-1 mt-7"
                        >
                            Tilmeld event
                        </button>
                        <button
                            v-else
                            @click="cancelRegistration()"
                            class="uppercase border-lait-yellow border-2 font-medium px-4 py-1 mt-7"
                        >
                            Afmeld event
                        </button>
                    </div>
                </div>
                <div class="bg-light-blue my-12 p-7">
                    <CommentSection
                        v-if="data.comments"
                        :comments="data.comments"
                        :currentId="currentId"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
