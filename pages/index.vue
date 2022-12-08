<script setup lang="ts">
import { ref } from "vue";
import { useUser } from "@/composable/useUser";

const { getUsername } = useUser();
const user = useSupabaseUser();

// Gets username for display
const userDetails = ref("");

const getDisplayUsername = async () => {
    await getUsername(user?.value.id).then((result) => {
        userDetails.value = result;
    });
};

// Get viewed events from user' localstorage
const localstorageArr = ref();
const getStorageData = () => {
    localstorageArr.value = JSON.parse(localStorage.getItem("viewedEvents"));
};

onMounted(() => {
    getDisplayUsername();
    getStorageData();
});

definePageMeta({
    middleware: "auth",
});
</script>

<template>
    <div>
        <div class="text-2xl font-medium">
            <p>
                Hej
                <span class="text-lait-yellow">{{ userDetails.username }}</span>
            </p>
        </div>

        <EventCard :localstorageArr="localstorageArr" />
    </div>
</template>
