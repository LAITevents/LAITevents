<template>
	<div class="max-w-lg mx-auto mt-8">
		<form
			@submit.prevent="() => (isSignUp ? signUp() : handleLogin())"
			class="flex flex-col gap-2"
		>
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
				:disabled="loading"
			>
				<span v-if="isSignUp"> Have an account? Log in instead </span>
				<span v-else> Create a new account </span>
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const loading = ref(false);
const isSignUp = ref(false);

const handleLogin = async () => {
	try {
		loading.value = true;
		const { error } = await supabase.auth.signIn({
			email: email.value,
			password: password.value,
		});
		if (error) throw error;
	} catch (error) {
		alert(error.error_description || error.message);
	} finally {
		loading.value = false;
		return navigateTo("/events");
	}
};

const signUp = async () => {
	const { user, error } = await supabase.auth.signUp({
		email: email.value,
		password: password.value,
	});
	console.log("user", user);
	console.log("error", error);
};
</script>
