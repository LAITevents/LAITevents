<script setup lang="ts">
import { ref } from "vue";
import { useEvent } from "@/composable/useEvent";
const { getEventsForUser } = useEvent();
const { getDepartment } = useEvent();

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
    email.value = data.website;
    avatar_path.value = data.avatar_url;
    if (data) {
        username.value = data.username;
        email.value = data.website;
        avatar_path.value = data.avatar_url;
    }
    loading.value = false;
};
getProfile();

// Update profil
const updateProfile = async () => {
    try {
        const { error } = await supabase.from("profiles").update(
            {
                id: user.value.id,
                username: username.value,
                website: email?.value,
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
        errorMsg.value`Error: ${error.message}`;
        setTimeout(() => {
            errorMsg.value = false;
        }, 5000);
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

onMounted(() => {
    getEventsForProfile();
});
</script>

<template>
    <div>
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
        <h1 class="text-2xl">Din profil</h1>
        <form>
            <ProfileAvatar v-model:path="avatar_path" @upload="updateProfile" />
            <div>
                <label for="email">Email</label>
                <input
                    class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="text"
                    :value="user?.email"
                    disabled
                />
            </div>
            <div>
                <label for="username">Username</label>
                <input
                    class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    v-model="username"
                />
            </div>
            <div>
                <label for="department">Team</label>
                <input
                    class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                />
            </div>

            <div>
                <input
                    type="submit"
                    @click="updateProfile"
                    class="cursor-pointer"
                    :value="loading ? 'Loading ...' : 'Update'"
                    :disabled="loading"
                />
            </div>
        </form>

        <div>
            <h1 class="text-2xl pt-10">Mine events</h1>
            <EventCard :events="profileEvents" :loaded="dataLoaded" />
        </div>
    </div>
</template>
