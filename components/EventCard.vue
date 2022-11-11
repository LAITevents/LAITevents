<script setup lang="ts">
import { useDashify } from "@/composable/dashify";
import { ref } from "vue";
import { useDateFormatter } from "~/composable/useDateFormatter";
const supabase = useSupabaseClient();
const { dashify } = useDashify();
const { formatDate } = useDateFormatter();
const selected = ref(["#ALLE", "#SJOV", "#WEBINAR", "#KURSUS", "#SPORT"]);

const props = defineProps({
    events: { type: Array },
    loaded: { type: Boolean },
});

const toggleOnClick = (event) => {
    const element = event.target;
    const text = element.textContent.trim();

    if (selected.value.includes(text)) {
        element.classList.add("line-through");
        selected.value.splice(selected.value.indexOf(text), 1);
    } else {
        element.classList.remove("line-through");
        selected.value.push(text);
    }
};

const filteredEvents = computed(() => {
    if (selected.value.length == 0) {
        return;
    } else {
        return props.events.filter(
            (event) => !selected.value.includes(event.category_id.name)
        );
    }
});
</script>

<template>
    <div v-if="loaded">
        <div
            class="flex space-x-6 space-y-2 flex-wrap lg:justify-end items-end cursor-pointer text-lait-yellow font-bold"
        >
            <div @click="toggleOnClick($event)">#ALLE</div>
            <div @click="toggleOnClick($event)">#SJOV</div>
            <div @click="toggleOnClick($event)">#WEBINAR</div>
            <div @click="toggleOnClick($event)">#KURSUS</div>
            <div @click="toggleOnClick($event)">#SPORT</div>
        </div>

        <div
            class="grid grid-cols-1 lg:grid-cols-12 gap-8"
            v-if="selected.length > 0"
        >
            <NuxtLink
                v-for="event in filteredEvents"
                :key="event.id"
                class="flex-col col-span-4 justify-between cursor-pointer lg:translate-event relative group"
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
                        <p class="uppercase text-xs text-lait-yellow">
                            {{ event.category_id.name }}
                        </p>
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
        <div v-else>
            <h1 class="text-3xl max-w-screen mx-auto">
                Der er ingen events lige pt. :(
            </h1>
        </div>
    </div>
</template>
