<script setup lang="ts">
import { useDashify } from "@/composable/dashify";
import { ref } from "vue";
import { useDateFormatter } from "~/composable/useDateFormatter";
const supabase = useSupabaseClient();
const data = ref([]);
const { dashify } = useDashify();
const { formatDate } = useDateFormatter();

const props = defineProps({
    events: { type: Object },
    loaded: { type: Boolean },
});
</script>

<template>
    <div v-if="loaded">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <NuxtLink
                v-for="(event, index) in props.events"
                :key="index"
                class="flex-col col-span-4 justify-between cursor-pointer translate-event relative group"
                :to="{
                    path: `/events/${dashify(event.title)}/${event.id}`,
                }"
            >
                <div
                    class="absolute bg-light-blue w-full h-full transition duration-500 ease-in-out group-hover:scale-95"
                ></div>
                <div class="relative pt-7 pb-8 px-8 w-full h-full">
                    <div
                        class="mb-2 flex justify-between items-center font-medium"
                    >
                        <h1 class="text-xl">
                            {{ event.title }}
                        </h1>
                        <p class="uppercase text-xs text-lait-yellow">#FEST</p>
                    </div>

                    <div class="flex mb-2 justify-between">
                        <div class="flex items-center gap-3">
                            <nuxt-icon
                                class="w-4 text-xl m-0"
                                name="EventCalendar"
                                fill
                            />
                            <p class="capitalize text-sm">
                                {{ formatDate(event.selected_date) }}
                            </p>
                        </div>
                        <nuxt-icon name="EventAlert" fill />
                    </div>
                    <img
                        class="object-cover w-full max-h-72"
                        v-if="event.img_url"
                        :src="event.img_url"
                    />
                </div>
            </NuxtLink>
        </div>
    </div>
</template>
