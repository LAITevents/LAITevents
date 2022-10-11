<script setup lang="ts">
definePageMeta({
    middleware: "auth",
});
import { useUser } from "@/composable/useUser";
import { ref } from "vue";
const supabase = useSupabaseClient();
const { getUsername } = useUser();
const user = supabase.auth.user();
const username = ref("");

const getDisplayUsername = async () => {
    username.value = await getUsername(user?.id);
};
getDisplayUsername();
</script>

<template>
    <div>
        <p class="text-2xl">
            Hello
            <span class="text-lait-yellow text-2xl">{{
                username || user?.email
            }}</span>
        </p>

        <EventCard />
    </div>
</template>
