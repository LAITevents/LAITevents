<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
const supabase = useSupabaseClient();
const data = ref(null);
const dataLoaded = ref(null);
const errorMsg = ref(null);
const statusMsg = ref(null);
const route = useRoute();

definePageMeta({
	middleware: "auth",
});

const currentId = route.params.id;

const getData = async () => {
	try {
		const { data: events, error } = await supabase
			.from("events")
			.select("*")
			.eq("id", currentId);

		if (error) throw error;
		data.value = events[0];
		dataLoaded.value = true;
		console.log(data.value);
	} catch (error) {
		errorMsg.value = error.message;
		setTimeout(() => {
			errorMsg.value = false;
		}, 5000);
	}
};

getData();
</script>

<template>
	<div>
		<!-- App message -->
		<div
			v-if="statusMsg || errorMsg"
			class="mb-10 p-4 rounded-md shadow-md bg-light-grey"
		>
			<p class="text-green-500">
				{{ statusMsg }}
			</p>
			<p class="text-red-500">
				{{ errorMsg }}
			</p>
		</div>

		<div v-if="dataLoaded">
			<h1>{{ data.eventTitle }}</h1>
			<p>{{ data.eventDescription }}</p>
		</div>
	</div>
</template>
