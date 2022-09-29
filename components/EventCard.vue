<script setup lang="ts">
import { useDashify } from "@/composable/dashify";
import { ref } from "vue";
const supabase = useSupabaseClient();
const data = ref([]);
const dataLoaded = ref(null);
const { dashify } = useDashify();
// Henter data fra Supabase
const getData = async () => {
	try {
		const { data: events, error } = await supabase
			.from("events")
			.select("*");

		if (error) throw error;
		data.value = events;
		dataLoaded.value = true;
	} catch (error) {
		console.warn(error.message);
	}
};
getData();
</script>

<template>
	<div v-if="dataLoaded">
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
		>
			<nuxt-link
				class="flex flex-col items-center p-8 cursor-pointer bg-light-blue"
				:to="{
					path: `/events/${dashify(event.title)}/${event.id}`,
				}"
				v-for="(event, index) in data"
				:key="index"
			>
				<img :src="event.img_url" class="rounded" />

				<h1 class="mb-2 text-center text-xl">
					{{ event.title }}
				</h1>

				<p class="mt-6 py-1 px-3">{{ event.description }}</p>
			</nuxt-link>
		</div>
	</div>
</template>
