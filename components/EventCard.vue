<script setup lang="ts">
import { useDashify } from "@/composable/dashify";
import { ref } from "vue";
import { useDateFormatter } from "~/composable/useDateFormatter";
import { useEvent } from "@/composable/useEvent";
const supabase = useSupabaseClient();
const { getData } = useEvent();
const { dashify } = useDashify();
const { formatDate } = useDateFormatter();

const activeIndex = ref(0);
const filterValue = ref("#ALLE");
const eventsList: any = ref(await getData());

const hashtags = ref([
    { name: "#ALLE", count: counterForHashtags("#ALLE").length },
    { name: "#SJOV", count: counterForHashtags("#SJOV").length },
    { name: "#WEBINAR", count: counterForHashtags("#WEBINAR").length },
    { name: "#KURSUS", count: counterForHashtags("#KURSUS").length },
    { name: "#SPORT", count: counterForHashtags("#SPORT").length },
]);

const setFilter = (hashtag: string) => {
    filterValue.value = hashtag;
};

const setActive = (index: number) => {
    activeIndex.value = index;
};

function counterForHashtags(filterValue: string) {
    if (filterValue == "#ALLE") {
        return eventsList.value;
    }
    return eventsList.value.filter(
        (event) => event.category_id.name === filterValue
    );
}

const filteredEvents = computed(() => {
    if (filterValue.value == "#ALLE") {
        return eventsList.value;
    }

    return eventsList.value.filter(
        (event) => event.category_id.name === filterValue.value
    );
});
</script>

<template>
    <div>
        <div>
            <ul
                class="flex flex-end space-x-6 space-y-2 flex-wrap lg:justify-end items-end text-lait-yellow font-bold"
            >
                <li
                    v-for="(hashtag, index) in hashtags"
                    :key="index"
                    @click="[setFilter(hashtag.name), setActive(index)]"
                >
                    <span
                        class="cursor-pointer"
                        :class="{ 'line-through': activeIndex === index }"
                    >
                        {{ hashtag.name }}
                    </span>
                    <span
                        class="absolute w-full text-[10px] font-regular top-44 ml-0.5"
                        >{{ hashtag.count }}</span
                    >
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
