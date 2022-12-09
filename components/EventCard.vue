<script setup lang="ts">
import { ref } from "vue";
import { useDashify } from "@/composable/dashify";
import { useDateFormatter } from "@/composable/useDateFormatter";
import { useEvent } from "@/composable/useEvent";
import IStorage from "@/interfaces/storageArray";
const supabase = useSupabaseClient();
const { getData } = useEvent();
const { dashify } = useDashify();
const { formatDate } = useDateFormatter();
const eventsList = ref(await getData());

const props = defineProps({
    localstorageArr: { type: Object as () => IStorage[], default: [] },
});

// Array of hashtags to filter from
const hashtags = ref([
    { name: "#ALLE", count: counterForHashtags("#ALLE")?.length },
    { name: "#FEST", count: counterForHashtags("#FEST")?.length },
    { name: "#FAGLIGHED", count: counterForHashtags("#FAGLIGHED")?.length },
    { name: "#SPORT", count: counterForHashtags("#SPORT")?.length },
    { name: "#HYGGE", count: counterForHashtags("#HYGGE")?.length },
]);

// Set filter value
const filterValue = ref("#ALLE");
const setFilter = (hashtag: string) => {
    filterValue.value = hashtag;
};

// Get active index
const activeIndex = ref(0);
const setActive = (index: number) => {
    activeIndex.value = index;
};

// function for counting hashtags
function counterForHashtags(filterValue: string) {
    if (filterValue == "#ALLE") {
        return eventsList.value;
    }
    return eventsList.value?.filter(
        (event) => event.category_id.name === filterValue
    );
}

const updateIndicator = (
    event_id: string,
    updated_at: string,
    created_at: string
) => {
    if (created_at !== updated_at) {
        const date = new Date(updated_at);
        const timestamp = date.getTime();
        let localStorageData = props.localstorageArr;

        if (localStorageData !== null) {
            return !(
                localStorageData.filter(
                    (event) =>
                        event.eventId == event_id && event.viewed_at > timestamp
                ).length > 0
            );
        } else {
            return true;
        }
    } else {
        return false;
    }
};

// Functions to filter events for display
const filteredEvents = computed(() => {
    if (filterValue.value == "#ALLE") {
        return eventsList.value;
    }

    return eventsList.value?.filter(
        (event) => event.category_id.name === filterValue.value
    );
});
</script>

<template>
    <div>
        <div>
            <ul
                class="flex flex-end space-x-4 lg:space-x-10 lg:space-y-1.5 mt-4 flex-wrap lg:justify-end items-end text-lait-yellow font-bold"
            >
                <li
                    v-for="(hashtag, index) in hashtags"
                    :key="index"
                    @click="[setFilter(hashtag.name), setActive(index)]"
                >
                    <span
                        class="cursor-pointer text-xs lg:text-sm font-medium"
                        :class="{ 'line-through': activeIndex === index }"
                    >
                        {{ hashtag.name }}
                    </span>

                    <span
                        class="absolute text-[10px] font-medium top-[145px] lg:top-48 ml-0.5"
                        >{{ hashtag.count }}</span
                    >
                </li>
            </ul>
        </div>

        <div
            v-if="filteredEvents.length"
            class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4"
        >
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
                        <div class="flex items-center gap-2">
                            <Icon size="24" name="ic:baseline-calendar-month" />
                            <p class="capitalize text-sm">
                                {{ formatDate(event.selected_date) }}
                            </p>
                        </div>
                        <Icon
                            v-if="
                                updateIndicator(
                                    event.id,
                                    event.updated_at,
                                    event.created_at
                                )
                            "
                            name="ic:baseline-notification-important"
                            title="Dette event er blevet opdateret for nyligt"
                            class="text-lait-yellow"
                            size="24"
                        />
                    </div>
                    <nuxt-img
                        class="object-cover w-full h-72"
                        v-if="event.img_url"
                        :src="event.img_url"
                    />
                    <div v-else class="h-72"></div>
                    <div class="pr-8 right-0 bottom-14 absolute">
                        <CountdownLabel :date="event.deadline_date" />
                    </div>
                </div>
            </NuxtLink>
        </div>
        <div v-else class="mt-10">
            <h1 class="text-xl">
                Der er endnu ikke oprettet et event med denne kategori😢
            </h1>
            <nuxt-link
                to="/create"
                class="text-lait-yellow font-medium text-base"
                >Klik her for at oprette event</nuxt-link
            >
        </div>
    </div>
</template>
