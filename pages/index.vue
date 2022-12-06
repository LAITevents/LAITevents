<script setup lang="ts">
import { ref } from "vue";
import { useUser } from "@/composable/useUser";

const { getUsername } = useUser();
const user = useSupabaseUser();
const userDetails = ref("");

const getDisplayUsername = async () => {
    await getUsername(user?.value.id).then((result) => {
        userDetails.value = result;
    });
};

onMounted(() => {
    getDisplayUsername();
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

        <EventCard />
    </div>
</template>
