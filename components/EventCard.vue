<script setup lang="ts">
import { useDashify } from "@/composable/dashify";
import { ref } from "vue";
import { useDateFormatter } from "~/composable/useDateFormatter";
const supabase = useSupabaseClient();
const { dashify } = useDashify();
const { formatDate } = useDateFormatter();
const selected = ref(["#SJOV", "#WEBINAR", "#KURSUS", "#SPORT"]);

const props = defineProps({
    events: { type: Array },
    loaded: { type: Boolean },
});

const filterValue = ref("");
const activeIndex = ref(0);

const hashtags = ref([
    { name: "#ALLE", count: 2 },
    { name: "#SJOV", count: 2 },
    { name: "#WEBINAR", count: 2 },
    { name: "#KURSUS", count: 2 },
    { name: "#SPORT", count: 2 },
]);

const setFilter = (hashtag: string) => {
    filterValue.value = hashtag;
};

const setActive = (index: number) => {
    activeIndex.value = index;
};

const filteredEvents = filterEvents(filterValue.value);

function filterEvents(filterValue: string) {
    let filteredArray = [];
    if (activeIndex.value == 0) {
        filteredArray = props.events;
    } else {
        filteredArray = props.events.filter((event: any) => {
            const tags = event.category_id.name;
            let events = null;
            if (tags != null && tags.includes(filterValue)) {
                events = event;
            }
            if (events != null) {
                return event;
            }
        });
    }
    return filteredArray;
}

// const toggleOnClick = (event) => {
//     const element = event.target;
//     const text = element.textContent.trim();

//     if (selected.value.includes(text)) {
//         element.classList.add("line-through");
//         selected.value.splice(selected.value.indexOf(text), 1);
//     } else {
//         element.classList.remove("line-through");
//         selected.value.push(text);
//     }
// };

// const filteredEvents = computed(() => {
//     if (selected.value.length == 4) {
//         return props.events;
//     } else {
//         return props.events.filter(
//             (event) => !selected.value.includes(event.category_id.name)
//         );
//     }
// });
</script>

<template>
    <div>
        <!-- <div
            class="flex space-x-6 space-y-2 flex-wrap lg:justify-end items-end cursor-pointer text-lait-yellow font-bold"
        >
            <div @click="toggleOnClick($event)">#SJOV</div>
            <div @click="toggleOnClick($event)">#WEBINAR</div>
            <div @click="toggleOnClick($event)">#KURSUS</div>
            <div @click="toggleOnClick($event)">#SPORT</div>
        </div> -->

        <div
            class="flex space-x-6 space-y-2 flex-wrap lg:justify-end items-end cursor-pointer text-lait-yellow font-bold"
        >
            <ul>
                <li
                    v-for="(hashtag, index) in hashtags"
                    :key="index"
                    @click="[setFilter(hashtag.name), setActive(index)]"
                >
                    <span :class="{ 'line-through': activeIndex === index }">
                        {{ hashtag.name }}
                    </span>
                    <span>{{ hashtag.count }}</span>
                </li>
            </ul>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <NuxtLink
                v-for="(event, index) in filteredEvents"
                :key="index + 1"
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
    </div>
</template>
