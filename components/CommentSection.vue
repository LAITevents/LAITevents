<script setup lang="ts">
import { ref } from "vue";
import IComments from "@/interfaces/comments";

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

const getProfile = async (user_id: string) => {
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
    if (commentFromUser.value.length > 0) {
        try {
            const content = commentFromUser.value;
            await supabase
                .from("comments")
                .insert([
                    { content, user_id: user.id, event_id: props.currentId },
                ]);
            commentFromUser.value = "";
        } catch (err) {
            console.log(err);
        }
    }
};

const getProfiles = async () => {
    comments.value.forEach((comment) => {
        users.value.push(comment.user_id);
    });
    let userdata = null;
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .in("id", users.value);
        if (error) throw error;
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

// Delete comment
const deleteUserComment = async (comment_id) => {
    try {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("comment_id", comment_id);
        if (error) throw error;
        displayComments.value = displayComments.value.filter(
            (comment) => comment.comment_id !== comment_id
        );
    } catch (error) {
        console.log(error);
    }
};

watchEffect(async () => {
    const subscription = supabase
        .from("comments")
        .on("*", async (payload) => {
            const user = await getProfile(payload.new.user_id);
            if (Object.keys(payload.new).length !== 0) {
                displayComments.value.push({ ...payload.new, ...user });
                comments.value.push({ ...payload.new, ...user });
                console.log(payload);
            }
        })
        .subscribe();
    return () => supabase.removeSubscription(subscription);
});

watch(comments, () => {
    comments.value.forEach((comment) => {
        comment.user_id;
    });
});
</script>

<template>
    <div>
        <ul>
            <li v-for="comment in displayComments" :key="comment.id">
                <div class="flex flex-row gap-4">
                    <div class="w-10 min-w-[40px] h-10">
                        <ProfileAvatar
                            :showUpload="false"
                            v-model:path="comment.avatar_url"
                        />
                    </div>
                    <div
                        class="flex flex-row justify-between w-full items-center gap-2"
                    >
                        <div>
                            <p class="text-lait-yellow text-xs">
                                {{ comment.username }}
                            </p>

                            <p>{{ comment.content }}</p>
                        </div>
                        <div
                            v-if="comment.user_id === user.id"
                            class="cursor-pointer text-lait-grey"
                            @click="deleteUserComment(comment.comment_id)"
                        >
                            x
                        </div>
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
                    class="py-2 px-3 w-full bg-[#87A3AA] text-white focus:outline-none placeholder-white flex-grow"
                    type="text"
                    placeholder="Skriv din kommentar her"
                    v-model="commentFromUser"
                />
                <button
                    class="text-white pl-1.5 absolute right-4 bottom-2 bg-[#87A3AA]"
                    type="submit"
                >
                    Send
                </button>
            </div>
        </form>
    </div>
</template>
