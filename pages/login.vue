<script setup lang="ts">
import { ref } from "vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const errorMsg = ref("");
const statusMsg = ref("");
const router = useRouter();

// Login functionality
const email = ref("");
const password = ref("");
const repeatedPassword = ref("");

const handleLogin = async () => {
	try {
		const { error } = await supabase.auth.signIn({
			email: email.value,
			password: password.value,
		});
		if (error) throw error;
	} catch (error) {
		errorMsg.value = "Dine login oplysninger er ikke korrekte, prøv igen";
		setTimeout(() => {
			errorMsg.value = "";
		}, 5000);
	}
};

// Signup functionality
const username = ref("");
const isSignUp = ref(false);

const signUp = async () => {
	if (password.value === repeatedPassword.value) {
		try {
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
			statusMsg.value = "Success: Check din mail for bekræftelses link";
			setTimeout(() => {
				statusMsg.value = "";
			}, 10000);
			if (error) throw error;
		} catch (error: any) {
			errorMsg.value = error.message;
			setTimeout(() => {
				errorMsg.value = "";
			}, 5000);
		}
	} else {
		errorMsg.value = "Adgangskoden er ikke ens";
		setTimeout(() => {
			errorMsg.value = "";
		}, 10000);
	}
};

watchEffect(() => {
	if (user.value) {
		router.push("/");
	}
});
</script>

<template>
	<div class="flex flex-col items-center justify-center h-[65vh]">
		<div>
			<ErrorMessage :statusMsg="statusMsg" :errorMsg="errorMsg" />

			<form
				@submit.prevent="() => (isSignUp ? signUp() : handleLogin())"
				class="flex flex-col mt-5"
			>
				<label for="email" class="">LAIT Mail</label>
				<input
					required
					class="py-2 px-3 mb-2 lg:w-96 bg-light-blue text-white custom-input-focus"
					type="email"
					v-model="email"
				/>

				<label v-if="isSignUp" for="username">Brugernavn</label>
				<input
					v-if="isSignUp"
					required
					class="py-2 px-3 mb-2 bg-light-blue text-white custom-input-focus"
					type="username"
					v-model="username"
				/>

				<label for="password" class="">Adgangskode</label>
				<input
					required
					class="py-2 px-3 mb-2 bg-light-blue text-white custom-input-focus"
					type="password"
					v-model="password"
				/>

				<label v-if="isSignUp" for="repeatedPassword" class=""
					>Gentag adgangskode</label
				>
				<input
					v-if="isSignUp"
					required
					class="py-2 px-3 mb-2 bg-light-blue text-white custom-input-focus"
					type="password"
					v-model="repeatedPassword"
				/>

				<div class="flex justify-end">
					<button class="text-[10px] text-lait-grey font-medium">
						Glemt adgangskode?
					</button>
				</div>
				<button
					type="submit"
					class="pt-8 font-medium rounded uppercase"
				>
					<span v-if="isSignUp"> Opret profil </span>
					<span class="uppercase" v-else> Log in </span>
				</button>
				<div
					class="text-sm text-center text-lait-yellow font-medium uppercase cursor-pointer"
					@click="isSignUp = !isSignUp"
				>
					<hr
						class="my-2 text-center w-60 h-0.5 border-light-blue bg-light-blue mx-auto"
					/>
					<span v-if="isSignUp"> Klik her for at logge ind </span>
					<span v-else> Eller opret profil </span>
				</div>
			</form>
		</div>
	</div>
</template>
