<script setup lang="ts">
import { ref } from "vue";

const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const username = ref("");
const isSignUp = ref(false);
const user = useSupabaseUser();

const handleLogin = async () => {
	try {
		const { error } = await supabase.auth.signIn({
			email: email.value,
			password: password.value,
		});
		if (error) throw error;
	} catch (error) {
	} finally {
		return navigateTo("/events");
	}
};

const signUp = async () => {
	const { user, error } = await supabase.auth.signUp(
		{
			email: email.value,
			password: password.value,
		},
		{
			data: {
				email: email.value,
				user_name: username.value,
			},
		}
	);
	console.log("user", user);
	console.log("error", error);
};
</script>

<template>
	<div class="max-w-lg mx-auto mt-8">
		<form
			@submit.prevent="() => (isSignUp ? signUp() : handleLogin())"
			class="flex flex-col gap-2"
		>
			<input
				v-if="isSignUp"
				class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type="username"
				placeholder="Username"
				v-model="username"
			/>
			<input
				class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type="email"
				placeholder="mail@lait.dk"
				v-model="email"
			/>

			<input
				class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type="password"
				placeholder="Password"
				v-model="password"
			/>
			<button
				type="submit"
				class="p-2 font-medium bg-blue-500 hover:bg-blue-700 rounded"
			>
				<span v-if="isSignUp"> Sign up </span>
				<span v-else> Log in </span>
			</button>
			<button
				@click="isSignUp = !isSignUp"
				class="w-full mt-8 text-sm text-center underline text-slate-300"
			>
				<span v-if="isSignUp"> Klik her for at logge ind </span>
				<span v-else> Opret en konto </span>
			</button>
		</form>
	</div>
</template>
