<script setup lang="ts">
import { ref } from "vue";

const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const username = ref("");
const department = ref(null);
const isSignUp = ref(false);
const user = useSupabaseUser();
const router = useRouter();

const handleLogin = async () => {
    try {
        const { error } = await supabase.auth.signIn({
            email: email.value,
            password: password.value,
        });
        if (error) throw error;
    } catch (error) {}

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
};

watchEffect(() => {
    if (user.value) {
        router.push("/");
    }
});
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div>
            <router-link to="/" class="relative">
                <svg
                    class="w-28 h-14 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 230 100"
                >
                    <path
                        fill="#fff"
                        d="M412.3547,70.1412 L412.3547,153.9492 L404.4387,153.9492 L404.4387,76.8932 L364.5087,76.8932 L364.5087,70.1412 L412.3547,70.1412 Z M202.915,69.9999 L202.915,147.0569 L242.845,147.0569 L242.845,153.8079 L195,153.8079 L195,69.9999 L202.915,69.9999 Z M349.049,70.0002 L349.049,153.8082 L341.134,153.8082 L341.134,70.0002 L349.049,70.0002 Z M294.4319,69.9999 L326.5579,153.8079 L318.4089,153.8079 L289.6589,76.7519 L273.2469,120.7499 L296.7199,120.7499 L299.0809,127.5009 L270.5689,127.5009 L260.6759,153.8079 L252.5279,153.8079 L285.4689,69.9999 L294.4319,69.9999 Z"
                        transform="translate(-195 -70)"
                    ></path>
                </svg>
            </router-link>
            <form
                @submit.prevent="() => (isSignUp ? signUp() : handleLogin())"
                class="flex flex-col mt-5"
            >
                <label v-if="isSignUp" for="username" class="">Username</label>

                <input
                    v-if="isSignUp"
                    class="py-2 px-3 mb-2 bg-light-blue text-white focus:outline-none"
                    type="username"
                    v-model="username"
                />

                <label for="email" class="">LAIT Mail</label>
                <input
                    class="py-2 px-3 mb-2 lg:w-96 bg-light-blue text-white focus:outline-none"
                    type="email"
                    v-model="email"
                />

                <label for="password" class="">Password</label>

                <input
                    class="py-2 px-3 mb-2 bg-light-blue text-white focus:outline-none"
                    type="password"
                    v-model="password"
                />
                <button type="submit" class="pt-8 font-medium rounded">
                    <span v-if="isSignUp"> Sign up </span>
                    <span v-else> Log in </span>
                </button>
                <button
                    @click="isSignUp = !isSignUp"
                    class="text-sm text-center underline text-lait-yellow font-bold"
                >
                    <hr
                        class="my-2 text-center w-60 h-0.5 border-light-blue bg-light-blue mx-auto"
                    />
                    <span v-if="isSignUp"> Klik her for at logge ind </span>
                    <span v-else> Eller opret profil </span>
                </button>
            </form>
        </div>
    </div>
</template>
