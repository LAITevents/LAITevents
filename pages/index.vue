<script setup lang="ts">
definePageMeta({
    middleware: "auth",
});
import { ref } from "vue";

const getDisplayUsername = async () => {
    await getUsername(user?.value.id).then((result) => {
        username.value = result;
    });
};

onMounted(() => {
    getDisplayUsername();
});

const user = useSupabaseUser();
const username = ref("");
const { getUsername } = useUser();
import { useUser } from "@/composable/useUser";
</script>

<template>
    <div>
        <p class="text-2xl">
            Hello
            <span class="text-lait-yellow text-2xl">{{ username }}</span>
        </p>

        <EventCard />
    </div>
</template>
