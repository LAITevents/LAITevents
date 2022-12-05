<script setup lang="ts">
import { ref } from "vue";
import { useEvent } from "@/composable/useEvent";
import { useDashify } from "@/composable/dashify";
const { getEventsForUser, getPastEventsForUser } = useEvent();
const { dashify } = useDashify();

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const username = ref("");
const password = ref("");
const repeatedPassword = ref("");
const email = ref("");
const avatar_path = ref("");
const profileEvents = ref([]);
const pastEvents = ref([]);

const dataLoaded = ref(false);
const errorMsg = ref("");
const statusMsg = ref("");
const loading = ref(true);

definePageMeta({
    middleware: "auth",
});

// Get profile data
const getProfile = async () => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.value.id)
        .single();
    if (error) throw error;
    username.value = data.username;
    email.value = data.email;
    avatar_path.value = data.avatar_url;
    if (data) {
        username.value = data.username;
        email.value = data.email;
        avatar_path.value = data.avatar_url;
    }
    loading.value = false;
};

// Update profil
const updateProfile = async () => {
    if (repeatedPassword.value.length && password.value.length) {
        if (password.value === repeatedPassword.value) {
            try {
                const { data, error } = await supabase.auth.update({
                    password: password.value,
                });
                statusMsg.value = "Success: Adgangskoden blev opdateret!";
                setTimeout(() => {
                    statusMsg.value = "";
                }, 5000);
            } catch (error) {
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
        return;
    }

    try {
        const { error } = await supabase.from("profiles").update(
            {
                id: user.value.id,
                username: username.value,
                avatar_url: avatar_path.value,
                updated_at: new Date(),
            },
            {
                returning: "minimal",
            }
        );
        statusMsg.value = "Success: Profil opdateret!";
        setTimeout(() => {
            statusMsg.value = "";
        }, 5000);
        if (error) throw error;
    } catch (error) {
        errorMsg.value = error.message;
        setTimeout(() => {
            errorMsg.value = "";
        }, 5000);
    }
};

const getEventsForProfile = async () => {
    profileEvents.value = await getEventsForUser(user.value.id);
    dataLoaded.value = true;
};

const getPastEvents = async () => {
    pastEvents.value = await getPastEventsForUser(user.value.id);
};

getPastEvents();

const deleteEvent = async (event_id) => {
    try {
        const { error } = await supabase
            .from("event_participants")
            .delete()
            .eq("event_id", event_id);
        if (error) throw error;
    } catch (error) {
        console.log(error);
    }

    try {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("event_id", event_id);
        if (error) throw error;
    } catch (error) {
        console.log(error);
    }

    try {
        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", event_id);
        if (error) throw error;
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    getEventsForProfile();
    getProfile();
});

watch(profileEvents.value, () => {
    getEventsForProfile();
});
</script>

<template>
    <div>
        <div class="grid grid-cols-12 gap-5">
            <h2
                class="text-3xl font-medium col-span-12 lg:col-start-2 lg:col-span-10"
            >
                Din profil
            </h2>

            <div class="col-span-6 lg:col-span-3 lg:col-start-2">
                <ProfileAvatar
                    v-model:path="avatar_path"
                    @upload="updateProfile"
                    :showUpload="true"
                />
            </div>

            <div class="flex flex-col lg:mb-6 col-span-12 lg:col-span-5">
                <ErrorMessage
                    class="-translate-y-12"
                    :statusMsg="statusMsg"
                    :errorMsg="errorMsg"
                />
                <form @submit.prevent="updateProfile">
                    <div>
                        <input
                            class="custom-input w-full custom-input-focus"
                            id="username"
                            type="text"
                            v-model="username"
                            placeholder="Skift brugernavn"
                        />
                    </div>
                    <div>
                        <input
                            class="custom-input w-full"
                            id="email"
                            type="text"
                            :value="user?.email"
                            disabled
                        />
                    </div>

                    <div class="flex gap-5 justify-between">
                        <input
                            class="custom-input w-full placeholder:text-lait-grey custom-input-focus"
                            type="password"
                            placeholder="Skift adgangskode"
                            v-model="password"
                        />
                        <input
                            class="custom-input w-full custom-input-focus"
                            type="password"
                            placeholder="Gentag adgangskode"
                            v-model="repeatedPassword"
                        />
                    </div>

                    <div class="text-right">
                        <input
                            type="submit"
                            class="cursor-pointer text-lait-yellow uppercase font-bold text-base"
                            :value="loading ? 'Loading ...' : 'Opdater profil'"
                            :disabled="loading"
                        />
                    </div>
                </form>
            </div>

            <div class="lg:col-span-12 col-span-10 lg:col-start-2">
                <h2 class="text-3xl font-medium pt-10 col-span-12 mb-5">
                    Mine events
                </h2>
                <ul>
                    <li v-for="event in profileEvents" :key="event.id">
                        <div class="flex mb-2 gap-5">
                            <NuxtLink
                                :to="{
                                    path: `/events/${dashify(event.title)}/${
                                        event.id
                                    }`,
                                }"
                            >
                                <p>{{ event.title }}</p>
                            </NuxtLink>
                            <NuxtLink
                                :to="{
                                    path: `/edit/${dashify(event.title)}/${
                                        event.id
                                    }`,
                                }"
                                class="flex items-center"
                            >
                                <nuxt-icon
                                    class="cursor-pointer align-middle"
                                    name="ProfileEdit"
                                />
                            </NuxtLink>
                            <nuxt-icon
                                @click="deleteEvent(event.id)"
                                class="text-2xl cursor-pointer"
                                name="ProfileDelete"
                            />
                        </div>
                    </li>
                </ul>
            </div>

            <div class="col-span-12 lg:col-start-2">
                <h2 class="text-3xl font-medium pt-10 text-lait-yellow mb-5">
                    Tidligere events
                </h2>
                <ul>
                    <li v-for="event in pastEvents" :key="event.id">
                        <div class="flex mb-2 gap-5">
                            <NuxtLink
                                :to="{
                                    path: `/events/${dashify(event.title)}/${
                                        event.id
                                    }`,
                                }"
                            >
                                <p>{{ event.title }}</p>
                            </NuxtLink>
                            <nuxt-icon
                                @click="deleteEvent(event.id)"
                                class="text-2xl cursor-pointer"
                                name="ProfileDelete"
                            />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
