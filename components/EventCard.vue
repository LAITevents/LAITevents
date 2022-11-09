<script setup lang="ts">
import { useDashify } from "@/composable/dashify";
import { ref } from "vue";
const supabase = useSupabaseClient();
const data = ref([]);
const { dashify } = useDashify();

const props = defineProps({
    events: { type: Object },
    loaded: { type: Boolean },
});
</script>

<template>
    <div v-if="loaded">
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            <nuxt-link
                v-for="event in props.events"
                :key="event.id"
                class="flex flex-col items-center p-8 cursor-pointer bg-light-blue"
                :to="{
                    path: `/events/${dashify(event.title)}/${event.id}`,
                }"
            >
                <img
                    v-if="event.img_url"
                    :src="event.img_url"
                    class="rounded"
                />

                <h1 class="mb-2 text-center text-xl">
                    {{ event.title }}
                </h1>

                <p v-if="event.description" class="mt-6 py-1 px-3">
                    {{ event.description }}
                </p>
            </nuxt-link>
        </div>
    </div>
</template>
