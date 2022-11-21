<script setup lang="ts">
import { ref } from "vue";
import { useEvent } from "@/composable/useEvent";
import { useDashify } from "~~/composable/dashify";
const { getEventsForUser } = useEvent();
const { getDepartment } = useEvent();
const { dashify } = useDashify();

const supabase = useSupabaseClient();
const username = ref("");
const email = ref("");
const avatar_path = ref("");
const loading = ref(true);
const user = useSupabaseUser();
const errorMsg = ref(null);
const statusMsg = ref(null);
const profileEvents = ref({});
const dataLoaded = ref(false);

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

// const getUserDepartment = async () => {
//     const { data: teams, error } = await supabase
//         .from("user_teams")
//         .select("team_id")
//         .eq("user_id", user?.value.id);
//     if (error) throw error;
// };
// getUserDepartment();

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

watch(profileEvents, () => {
    getEventsForProfile();
});
</script>

<template>
    <div>
        <div class="grid grid-cols-12 gap-5">
            <!-- Status Message -->
            <!-- <div
                v-if="statusMsg || errorMsg"
                class="mb-10 p-4 bg-light-grey rounded-md shadow-lg"
            >
                <p class="text-at-light-green">
                    {{ statusMsg }}
                </p>
                <p class="text-red-500">{{ errorMsg }}</p>
            </div> -->
            <h2
                class="text-3xl font-medium col-span-8 lg:col-start-2 lg:col-span-10"
            >
                Din profil
            </h2>

            <div class="col-span-8 lg:col-span-3 lg:col-start-2">
                <p class="">Upload / skift billede</p>
                <ProfileAvatar
                    v-model:path="avatar_path"
                    @upload="updateProfile"
                    :showUpload="true"
                />
            </div>

            <div class="col-span-12 lg:col-span-5">
                <form>
                    <div class="flex flex-col">
                        <label for="username">Username</label>
                        <input
                            class="custom-input"
                            id="username"
                            type="text"
                            v-model="username"
                        />
                    </div>
                    <div class="flex flex-col">
                        <label for="email">Email</label>
                        <input
                            class="custom-input"
                            id="email"
                            type="text"
                            :value="user?.email"
                            disabled
                        />
                    </div>

                    <div class="flex flex-col">
                        <label for="department">Team</label>
                        <input class="custom-input" type="text" />
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
