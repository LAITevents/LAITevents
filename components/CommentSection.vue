<script setup lang="ts">
import { ref } from "vue";
import IComments from "@/interfaces/comments";
import { useUser } from "~/composable/useUser";

const props = defineProps({
    comments: { type: Object as () => IComments[], default: [] },
    currentId: { type: String },
});

const supabase = useSupabaseClient();
const commentFromUser = ref("");
const user = supabase.auth.user();
const comments = ref(props.comments);
const displayComments = ref([]);
const users = ref([]);

watchEffect(async () => {
    const subscription = supabase
        .from("comments")
        .on("INSERT", async (payload) => {
            const user = await getProfile(payload.new.user_id);
            displayComments.value.push({ ...payload.new, ...user });
        })
        .subscribe();
    return () => supabase.removeSubscription(subscription);
});

watch(comments, () => {
    comments.value.forEach((comment) => {
        comment.user_id;
    });
});

const getProfile = async (user_id) => {
    let user = null;
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user_id);
        if (error) throw error;
        user = data[0];
    } catch (error) {
        console.log(error);
    }
    return user;
};

// Send comment to database
const sendComment = async (evt) => {
    evt.preventDefault();
    try {
        const content = commentFromUser.value;
        await supabase
            .from("comments")
            .insert([{ content, user_id: user.id, event_id: props.currentId }]);
        commentFromUser.value = "";
    } catch (err) {
        console.log(err);
    }
};

const getProfiles = async () => {
    comments.value.forEach((comment) => {
        users.value.push(comment.user_id);
    });
    let userdata: [{ id: string }] = null;
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .in("id", users.value);
        if (error) throw error;
        // @ts-ignore
        userdata = data;
    } catch (error) {
        console.log(error);
    }

    if (userdata) {
        displayComments.value = comments.value.map((comment) => {
            return {
                ...comment,
                ...userdata.find((obj) => obj.id === comment.user_id),
            };
        });
    }
};
getProfiles();
</script>

<template>
    <div>
        <ul>
            <li v-for="comment in displayComments" :key="comment.id">
                <div class="flex gap-4">
                    <div class="w-10 h-10">
                        <ProfileAvatar
                            :showUpload="false"
                            v-model:path="comment.avatar_url"
                        />
                    </div>
                    <div class="flex-row">
                        <p class="text-lait-yellow text-xs">
                            {{ comment.username }}
                        </p>

                        <p>{{ comment.content }}</p>
                    </div>
                </div>

                <hr
                    class="my-5 text-center w-60 h-0.5 border-lait-grey opacity-30 mx-auto"
                />
            </li>
        </ul>

        <form @submit.prevent="sendComment" class="flex flex-row">
            <div class="relative w-full">
                <input
                    class="py-2 px-3 mb-2 w-full bg-[#87A3AA] text-white focus:outline-none placeholder-white flex-grow"
                    type="text"
                    placeholder="Skriv din kommentar her"
                    v-model="commentFromUser"
                />
                <button
                    class="text-white absolute right-4 bottom-3.5"
                    type="submit"
                >
                    Send
                </button>
            </div>
        </form>
    </div>
</template>
