<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
const supabase = useSupabaseClient();
const data = ref(null);
const dataLoaded = ref(null);
const statusMsg = ref(null);
const errorMsg = ref(null);
const route = useRoute();
const user = supabase.auth.user();
const currentUser = ref("");
const eventParticipants = ref([]);

const registered = ref(false);

definePageMeta({
	middleware: "auth",
});

const currentId = route.params.id;

// Henter event data
const getData = async () => {
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
getData();

const getParticipants = async () => {
	try {
		const { data: participants, error } = await supabase
			.from("event_participants")
			.select("*")
			.eq("event_id", currentId);
		if (error) throw error;
		participants.forEach(async (participant) => {
			const user = await getUser(participant.user_id);
			eventParticipants.value.push(user);
			updateRegistrationStatus();
		});

		console.log(participants);
	} catch (error) {
		errorMsg.value = error.message;
		setTimeout(() => {
			errorMsg.value = false;
		}, 5000);
	}
};
getParticipants();

// Henter username fra profil tabellen
const getCurrentUser = async () => {
	const { data: profiles } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", user.id);
	currentUser.value = profiles[0].username;
};
getCurrentUser();

const getUser = async (participant) => {
	const { data: profiles } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", participant);
	// currentUser.value = profiles[0].username;
	console.log(profiles);
	return profiles[0].username;
};

const updateRegistrationStatus = () => {
	registered.value = eventParticipants.value.includes(currentUser.value);
};

// Tilmeld event
const registerEvent = async () => {
	if (eventParticipants.value.includes(currentUser.value)) return;
	try {
		const { error } = await supabase.from("event_participants").insert({
			event_id: currentId,
			user_id: user.id,
		});
		if (error) throw error;
		getParticipants();
	} catch (error) {
		errorMsg.value = error.message;
	}
};

// Afmeld event
const cancelRegistration = async () => {
	try {
		const { error } = await supabase
			.from("events")
			.update({ participants: "" })
			.eq("participants", user.id);
		if (error) throw error;
		registered.value = false;
	} catch (error) {
		errorMsg.value = error.message;
	}
};
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
		<button v-else>Afmeld</button>
	</div>
</template>
