<script setup lang="ts">
import { useDashify } from "@/composable/dashify";
import { ref } from "vue";
import { useDateFormatter } from "@/composable/useDateFormatter";
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
    { name: "#FEST", count: counterForHashtags("#FEST").length },
    { name: "#FAGLIGHED", count: counterForHashtags("#FAGLIGHED").length },
    { name: "#SPORT", count: counterForHashtags("#SPORT").length },
    { name: "#HYGGE", count: counterForHashtags("#HYGGE").length },
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

const showUpdateIndicator = (created_at: string, updated_at: string) => {
    if (created_at !== updated_at) {
        return true;
    } else {
        return false;
    }
};

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
                class="flex flex-end space-x-4 lg:space-x-8 lg:space-y-1.5 mt-4 flex-wrap lg:justify-end items-end text-lait-yellow font-bold"
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
                        <nuxt-icon
                            v-if="
                                showUpdateIndicator(
                                    event.updated_at,
                                    event.created_at
                                )
                            "
                            name="EventAlert"
                            title="Dette event er blevet opdateret for nyligt"
                            fill
                        />
                    </div>
                    <nuxt-img
                        class="object-cover w-full h-72"
                        v-if="event.img_url"
                        :src="event.img_url"
                    />
                    <div v-else class="h-72"></div>
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
