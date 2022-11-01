<script setup lang="ts">
const user = useSupabaseUser();
const router = useRouter();

const signOut = async () => {
    const supabase = useSupabaseClient();
    await supabase.auth.signOut().then(() => {
        navigateTo({ path: "/login" });
    });
};
</script>

<template>
    <header class="flex flex-row relative py-12 items-center justify-between">
        <router-link to="/" class="relative w-28">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 100">
                <path
                    fill="#fff"
                    d="M412.3547,70.1412 L412.3547,153.9492 L404.4387,153.9492 L404.4387,76.8932 L364.5087,76.8932 L364.5087,70.1412 L412.3547,70.1412 Z M202.915,69.9999 L202.915,147.0569 L242.845,147.0569 L242.845,153.8079 L195,153.8079 L195,69.9999 L202.915,69.9999 Z M349.049,70.0002 L349.049,153.8082 L341.134,153.8082 L341.134,70.0002 L349.049,70.0002 Z M294.4319,69.9999 L326.5579,153.8079 L318.4089,153.8079 L289.6589,76.7519 L273.2469,120.7499 L296.7199,120.7499 L299.0809,127.5009 L270.5689,127.5009 L260.6759,153.8079 L252.5279,153.8079 L285.4689,69.9999 L294.4319,69.9999 Z"
                    transform="translate(-195 -70)"
                ></path>
            </svg>
        </router-link>
        <div>
            <ul class="flex gap-10 cursor-pointer">
                <nuxt-link v-if="user" to="/profile">Profil</nuxt-link>
                <nuxt-link v-if="user" to="/create">Opret</nuxt-link>
                <nuxt-link v-if="user" @click="signOut">Log ud</nuxt-link>
                <nuxt-link v-if="!user" to="/login">Login</nuxt-link>
            </ul>
        </div>
    </header>
</template>
