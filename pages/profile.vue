<script setup lang="ts">
import { ref } from "vue";
import { useEvent } from "@/composable/useEvent";
import { useDashify } from "@/composable/dashify";
const { getEventsForUser } = useEvent();
const { dashify } = useDashify();

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const username = ref("");
const password = ref("");
const repeatedPassword = ref("");
const email = ref("");
const avatar_path = ref("");
const profileEvents = ref([]);

const dataLoaded = ref(false);
const errorMsg = ref(null);
const statusMsg = ref(null);
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
        if (error) throw error;
        statusMsg.value = "Success: Profile Updated!";
        setTimeout(() => {
            statusMsg.value = false;
        }, 5000);
    } catch (error) {
        console.log(error);
    }
};

const getEventsForProfile = async () => {
    profileEvents.value = await getEventsForUser(user.value.id);
    dataLoaded.value = true;
};

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
            <h2
                class="text-3xl font-medium col-span-8 lg:col-start-2 lg:col-span-10"
            >
                Din profil
            </h2>

            <!-- <div class="col-span-8 lg:col-span-3 lg:col-start-2">
                <p class="">Upload / skift billede</p>
                <ProfileAvatar
                    v-model:path="avatar_path"
                    @upload="updateProfile"
                    :showUpload="true"
                />
            </div> -->

            <div
                class="col-span-11 md:col-span-5 lg:col-span-3 md:col-start-2 lg:col-start-2"
            >
                <p>Upload billede</p>
                <div>
                    <label for="single">
                        <div class="w-full h-auto">
                            <img v-if="src" :src="src" class="object-fill" />
                            <svg
                                v-else
                                viewBox="0 0 310 300"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="2.5"
                                    y="2.5"
                                    width="304.926"
                                    height="295"
                                    stroke="#4C757F"
                                    stroke-width="3"
                                    stroke-dasharray="10 10"
                                />
                                <path
                                    d="M216.176 159.151V186.874C216.176 194.435 209.905 200.735 202.378 200.735H107.548C100.022 200.735 93.75 194.435 93.75 186.874V159.151C93.75 157.135 95.5061 155.371 97.5131 155.371C99.5201 155.371 101.276 157.135 101.276 159.151V186.874C101.276 190.402 104.036 193.174 107.548 193.174H202.378C205.891 193.174 208.65 190.402 208.65 186.874V159.151C208.65 157.135 210.406 155.371 212.413 155.371C214.42 155.371 216.176 156.883 216.176 159.151ZM162.24 101.186C160.233 99.1697 157.473 98.1616 154.965 98.1616C152.456 98.1616 149.696 99.1697 147.689 101.186L130.128 118.828C128.623 120.34 128.623 122.608 130.128 124.12C131.633 125.632 133.891 125.632 135.397 124.12L151.202 108.243V169.99C151.202 172.006 152.958 173.77 154.965 173.77C156.972 173.77 158.728 172.006 158.728 169.99V108.496L174.533 124.373C176.038 125.886 178.296 125.886 179.801 124.373C181.306 122.861 181.306 120.593 179.801 119.081L162.24 101.186Z"
                                    fill="#D9D9D9"
                                />
                            </svg>
                        </div>
                    </label>
                    <div>
                        <input
                            class="file:bg-lait-blue file:text-lait-yellow file:font-bold file:text file:border-none"
                            type="file"
                            id="single"
                            accept="image/*"
                            @change="updateProfile"
                            :disabled="uploading"
                        />
                    </div>
                </div>
            </div>

            <div class="flex flex-col lg:my-6 col-span-12 lg:col-span-5">
                <form class="">
                    <div class="">
                        <input
                            class="custom-input w-full"
                            id="username"
                            type="text"
                            v-model="username"
                        />
                    </div>
                    <div class="">
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
                            class="custom-input w-full placeholder:text-lait-grey"
                            type="password"
                            placeholder="Skift adgangskode"
                            v-model="password"
                        />
                        <input
                            class="custom-input w-full"
                            type="password"
                            placeholder="Gentag adgangskode"
                            v-model="repeatedPassword"
                        />
                    </div>

                    <div class="text-right">
                        <input
                            type="submit"
                            @click="updateProfile"
                            class="cursor-pointer text-lait-yellow uppercase font-bold text-base"
                            :value="loading ? 'Loading ...' : 'Opdater profil'"
                            :disabled="loading"
                        />
                    </div>
                </form>
            </div>

            <h2
                class="text-3xl font-medium pt-10 col-span-12 lg:col-span-8 lg:col-start-2"
            >
                Mine events
            </h2>

            <div class="lg:col-span-12 col-span-10 lg:col-start-2">
                <ul>
                    <li v-for="event in profileEvents" :key="event.id">
                        <div class="flex gap-5">
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

            <h2
                class="lg:col-start-2 text-3xl font-medium pt-10 col-span-12 text-lait-yellow"
            >
                Tidligere events
            </h2>
        </div>
    </div>
</template>
