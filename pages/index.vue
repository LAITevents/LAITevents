<script setup lang="ts">
import { ref } from "vue";
import { useUser } from "@/composable/useUser";

definePageMeta({
  middleware: "auth",
});

const { getUsername } = useUser();
const user = useSupabaseUser();
const username = ref("");

const getDisplayUsername = async () => {
  await getUsername(user?.value.id).then((result) => {
    username.value = result;
  });
};

onMounted(() => {
  getDisplayUsername();
});
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
