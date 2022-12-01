<script setup lang="ts">
import { useUser } from "@/composable/useUser";
import { useEvent } from "@/composable/useEvent";
import { useRoute, useRouter } from "vue-router";

import { ref } from "vue";
import { useDateFormatter } from "@/composable/useDateFormatter";
const { formatDate, formatTime } = useDateFormatter();
const { getDepartment } = useEvent();
const { getUsername } = useUser();

const supabase = useSupabaseClient();
const dataLoaded = ref(null);
const data = ref({});
const departmentName = ref();

const statusMsg = ref(null);
const errorMsg = ref(null);
const route = useRoute();
const user = supabase.auth.user();
const eventParticipants = ref([]);

const registered = ref(false);

definePageMeta({
    middleware: "auth",
});

const currentId = route.params.id;

// Gets event data from supabase
const getEvents = async () => {
    try {
        const { data: events, error } = await supabase
            .from("events")
            .select("*, event_participants(*), comments(*), category_id(*)")
            .eq("id", currentId);
        if (error) throw error;
        dataLoaded.value = true;
        data.value = events[0];
        if (events[0].team_id) {
            await getDepartment(events[0].team_id).then(
                (result) => (departmentName.value = result[0].team_title)
            );
        }
    } catch (error) {
        errorMsg.value = error.message;
        setTimeout(() => {
            errorMsg.value = false;
        }, 5000);
    }
};
getEvents();

// Gets participants for the specific event id
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
            if (participant.user_id === user.id) registered.value = true;
        });
    } catch (error) {
        errorMsg.value = error.message;
        setTimeout(() => {
            errorMsg.value = false;
        }, 5000);
    }
};
getParticipants();

// Register an event
const registerEvent = async () => {
    if (registered.value) return;
    try {
        const { error } = await supabase.from("event_participants").insert({
            event_id: currentId,
            user_id: user.id,
        });
        if (error) throw error;
        registered.value = true;
    } catch (error) {
        errorMsg.value = error.message;
    }
};

// Cancel event registration
const cancelRegistration = async () => {
    try {
        const { error } = await supabase
            .from("event_participants")
            .delete()
            .match({ event_id: currentId, user_id: user.id })
            .select();

        if (error) throw error;
        registered.value = false;
    } catch (error) {
        errorMsg.value = error.message;
    }
};

watch(registered, () => {
    getParticipants();
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
                    <img
                        :src="data.img_url"
                        class="w-full h-60 md:h-72 lg:w-full lg:h-96 object-cover"
                    />
                    <h1 class="font-medium text-2xl mt-4 mb-3">
                        {{ data.title }}
                    </h1>
                    <p class="">{{ data.description }}</p>
                </div>
                <div>
                    <h3 class="font-medium text-2xl mb-3">
                        Deltagere
                        <span class="text-lait-yellow text-2xl"
                            >({{ eventParticipants.length }})</span
                        >
                    </h3>
                    <div class="flex gap-4 col-span-5">
                        <template
                            v-for="participant in eventParticipants"
                            :key="participant"
                        >
                            <div class="flex resize-image mb-20">
                                <ProfileAvatar
                                    :showUpload="false"
                                    v-model:path="participant.avatar_url"
                                />
                                <p class="bg-light-blue px-4 py-2">
                                    {{ participant.username }}
                                </p>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="lg:col-start-8 col-span-12 lg:col-span-4">
                <div class="p-7 bg-light-blue">
                    <h3 class="text-center font-medium mb-4">
                        Sidste chance for tilmelding:
                        <span class="capitalize text-lait-yellow">{{
                            formatDate(data.deadline_date)
                        }}</span>
                    </h3>
                    <div class="flex gap-2 capitalize">
                        <nuxt-icon class="text-xl" name="EventCalendar" />

                        {{ formatDate(data.selected_date) }}
                    </div>
                    <div class="flex gap-2 capitalize my-2">
                        <nuxt-icon class="text-2xl -ml-0.5" name="EventClock" />

                        Kl: {{ formatTime(data.selected_date) }}
                    </div>
                    <!-- <div>Event for: {{ departmentName || "Alle" }}</div> -->

                    <MapsView
                        v-if="data.place_lat && data.place_lng && data.place_id"
                        :placeLat="data.place_lat"
                        :placeLng="data.place_lng"
                        :placeId="data.place_id"
                    />

                    <div class="text-lait-yellow text-center">
                        <button
                            v-if="!registered"
                            @click="registerEvent()"
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
