<template>
	<div>
		<p>Hello {{ user?.email }}</p>
		<h1 class="text-xl">Events here</h1>
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
		console.log(data.value);
	} catch (error) {
		console.warn(error.message);
	}
};

getData();
</script>
