<template>
	<div class="mx-auto p-8 flex items-start rounded-md shadow-lg">
		<!-- Status Message -->

		<div
			v-if="statusMsg || errorMsg"
			class="mb-10 p-4 bg-light-grey rounded-md shadow-lg"
		>
			<p class="text-at-light-green">
				{{ statusMsg }}
			</p>
			<p class="text-red-500">{{ errorMsg }}</p>
		</div>

		<form @submit.prevent="addEvent" class="flex flex-col gap-y-5 w-full">
			<h1 class="text-2xl">Opret event</h1>

			<div class="flex flex-col">
				<label for="event-name" class="mb-1">Titel</label>
				<input
					type="text"
					required
					class="p-2 text-gray-500 focus:outline-none"
					id="event-name"
					v-model="eventTitle"
				/>
			</div>

			<div class="flex flex-col">
				<label for="event-description" class="mb-1">Beskrivelse</label>

				<input
					type="text"
					required
					class="p-2 text-gray-500 focus:outline-none"
					id="event-description"
					v-model="eventDescription"
				/>
			</div>
			<button
				type="submit"
				class="p-2 font-medium bg-blue-500 hover:bg-blue-700 rounded"
			>
				Opret Event
			</button>
		</form>
	</div>
</template>
<script setup lang="ts">
const supabase = useSupabaseClient();
const statusMsg = ref(null);
const errorMsg = ref(null);
const eventTitle = ref("");
const eventDescription = ref("");

// Create event
const addEvent = async () => {
	try {
		const { error } = await supabase.from("events").insert([
			{
				eventTitle: eventTitle.value,
				eventDescription: eventDescription.value,
			},
		]);
		if (error) throw error;
		statusMsg.value = "Success: Event oprettet";
		eventTitle.value = null;
		eventDescription.value = null;
		setTimeout(() => {
			statusMsg.value = false;
		}, 5000);
	} catch (error) {
		errorMsg.value = `Error: ${error.message}`;
		setTimeout(() => {
			errorMsg.value = false;
		}, 5000);
	}
};
</script>
