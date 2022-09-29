<script setup lang="ts">
import { useUser } from "@/composable/useUser";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
const supabase = useSupabaseClient();
const dataLoaded = ref(null);
const data = ref();
const statusMsg = ref(null);
const errorMsg = ref(null);
const route = useRoute();
const user = supabase.auth.user();
const eventParticipants = ref([]);
const { getUsername } = useUser();

const registered = ref(false);

definePageMeta({
	middleware: "auth",
});

const currentId = route.params.id;

// Gets event data from supabase

const getEvents = async () => {
	try {
		const { data: events, error } = await supabase
			.from("events")
			.select("*, event_participants(*)")
			.eq("id", currentId);
		if (error) throw error;
		data.value = events[0];
		dataLoaded.value = true;
	} catch (error) {
		errorMsg.value = error.message;
		setTimeout(() => {
			errorMsg.value = false;
		}, 5000);
	}
};
getEvents();

// Gets participants for the specific event id
const getParticipants = async () => {
	eventParticipants.value = [];
	try {
		const { data: participants, error } = await supabase
			.from("event_participants")
			.select("*")
			.eq("event_id", currentId);
		if (error) throw error;
		participants.forEach(async (participant) => {
			const userName = await getUsername(participant.user_id);
			eventParticipants.value.push(userName);
			if (participant.user_id === user.id) registered.value = true;
		});
	} catch (error) {
		errorMsg.value = error.message;
		setTimeout(() => {
			errorMsg.value = false;
		}, 5000);
	}
};
getParticipants();

// Register an event
const registerEvent = async () => {
	if (registered.value) return;
	try {
		const { error } = await supabase.from("event_participants").insert({
			event_id: currentId,
			user_id: user.id,
		});
		if (error) throw error;
		registered.value = true;
	} catch (error) {
		errorMsg.value = error.message;
	}
};

// Cancel event registration
const cancelRegistration = async () => {
	try {
		const { error } = await supabase
			.from("event_participants")
			.delete()
			.match({ event_id: currentId, user_id: user.id })
			.select();

		if (error) throw error;
		registered.value = false;
	} catch (error) {
		errorMsg.value = error.message;
	}
};

watch(registered, () => {
	getParticipants();
});
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
			<img :src="data.img_url" class="w-80 h-auto object-cover rounded" />
			<h1>{{ data.title }}</h1>
			<p>{{ data.description }}</p>
			<template
				v-for="participant in eventParticipants"
				:key="participant"
			>
				<p>Deltagere: {{ participant }}</p>
			</template>
		</div>
		<button v-if="!registered" @click="registerEvent()">Tilmeld</button>
		<button v-else @click="cancelRegistration()">Afmeld</button>
	</div>
</template>
