<template>
	<div>
		<p class="text-2xl">
			Hello
			<span class="text-lait-yellow text-2xl">{{ user?.email }}</span>
		</p>

		<div v-if="dataLoaded">
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
			>
				<router-link
					class="flex flex-col items-center p-8 cursor-pointer bg-light-blue"
					:to="{ name: '' }"
					v-for="(event, index) in data"
					:key="index"
				>
					<h1 class="mb-2 text-center text-xl">
						{{ event.eventTitle }}
					</h1>

					<p class="mt-6 py-1 px-3">{{ event.eventDescription }}</p>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
});
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const data = ref([]);
const dataLoaded = ref(null);

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
