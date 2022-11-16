<script setup lang="ts">
import { useUser } from "@/composable/useUser";
import { useEvent } from "@/composable/useEvent";
import { useRoute, useRouter } from "vue-router";
const { formatDate, formatTime } = useDateFormatter();

import { ref } from "vue";
import { useDateFormatter } from "@/composable/useDateFormatter";
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
            const userName = await getUsername(participant.user_id);
            eventParticipants.value.push(userName);
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
        <div v-if="dataLoaded" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="col-start-2 col-span-5">
                <p
                    class="flex flex-end lg:justify-end items-end text-lait-yellow text-xs font-bold"
                >
                    {{ data.category_id.name }}
                </p>
                <img
                    :src="data.img_url"
                    class="lg:w-full h-auto object-cover"
                />
                <h1>{{ data.title }}</h1>
                <p>{{ data.description }}</p>
                <template
                    v-for="participant in eventParticipants"
                    :key="participant"
                >
                    <p>Deltagere: {{ participant }}</p>
                </template>
            </div>

            <div class="lg:col-start-8 col-span-12 lg:col-span-4">
                <div class="p-7 bg-light-blue">
                    <div>Dato: {{ formatDate(data.selected_date) }}</div>
                    <div>Tidspunkt: {{ formatTime(data.selected_date) }}</div>
                    <!-- <div>Event for: {{ departmentName || "Alle" }}</div> -->

                    <MapsView
                        v-if="data.place_lat && data.place_lng && data.place_id"
                        :placeLat="data.place_lat"
                        :placeLng="data.place_lng"
                        :placeId="data.place_id"
                    />

                    <button v-if="!registered" @click="registerEvent()">
                        Tilmeld
                    </button>
                    <button v-else @click="cancelRegistration()">Afmeld</button>
                </div>
                <div class="bg-light-blue mt-12 p-7">
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
