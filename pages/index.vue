<script setup lang="ts">
import { ref } from "vue";
import { useUser } from "@/composable/useUser";
import { useEvent } from "@/composable/useEvent";

definePageMeta({
    middleware: "auth",
});
const { getData } = useEvent();
const { getUsername } = useUser();
const user = useSupabaseUser();
const username = ref("");
const events = ref({});
const dataLoaded = ref(null);

const getDisplayUsername = async () => {
    await getUsername(user?.value.id).then((result) => {
        username.value = result;
    });
};

const getEventData = async () => {
    events.value = await getData();
    dataLoaded.value = true;
};

onMounted(() => {
    getDisplayUsername();
    getEventData();
});
</script>

<template>
    <div>
        <div class="text-2xl font-medium">
            <p>
                Hello
                <span class="text-lait-yellow">{{ username }}</span>
            </p>
        </div>
        <TagList :events="events" />
        <EventCard :events="events" :loaded="dataLoaded" />
    </div>
</template>
