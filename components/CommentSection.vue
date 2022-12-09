<script setup lang="ts">
import { ref } from "vue";
import IComments from "@/interfaces/comments";
import { useDateFormatter } from "@/composable/useDateFormatter";
import { useUser } from "@/composable/useUser";
const { getProfileInformation } = useUser();
const { formatCommentDate } = useDateFormatter();

const props = defineProps({
    comments: { type: Object as () => IComments[], default: [] },
    currentId: { type: String },
});

const supabase = useSupabaseClient();
const user = supabase.auth.user();

// Send comment to database
const commentFromUser = ref("");
const comments = ref(props.comments);

const sendComment = async (evt: Event) => {
    evt.preventDefault();
    if (commentFromUser.value.length > 0) {
        try {
            const content = commentFromUser.value;
            await supabase
                .from("comments")
                .insert([
                    { content, user_id: user?.id, event_id: props.currentId },
                ]);
            commentFromUser.value = "";
        } catch (err) {
            console.log(err);
        }
    }
};

// get profileinfo on users from comments and add to displayComments
const users = ref([]);
const displayComments = ref();

const getProfiles = async () => {
    comments.value.forEach((comment) => {
        users.value.push(comment.user_id);
    });
    let userdata: any = null;
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
                ...userdata.find((obj: any) => obj.id === comment.user_id),
            };
        });
    }
};
getProfiles();

// Delete comment
const deleteUserComment = async (comment_id: number) => {
    try {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("comment_id", comment_id);
        if (error) throw error;
        displayComments.value = displayComments.value.filter(
            (comment: any) => comment.comment_id !== comment_id
        );
    } catch (error) {
        console.log(error);
    }
};

watchEffect(async () => {
    const subscription = supabase
        .from("comments")
        .on("*", async (payload) => {
            const user = await getProfileInformation(payload.new.user_id);
            if (Object.keys(payload.new).length !== 0) {
                displayComments.value.push({ ...payload.new, ...user });
                comments.value.push({ ...payload.new, ...user });
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
        <ul class="max-h-[500px] overflow-y-scroll overflow-x-hidden scrollbar">
            <li v-for="comment in displayComments" :key="comment.id">
                <div class="flex flex-row gap-4">
                    <div class="w-10 min-w-[40px] h-10">
                        <ProfileAvatar
                            :showUpload="false"
                            v-model:path="comment.avatar_url"
                            class="custom-image-resize"
                        />
                    </div>
                    <div
                        class="flex flex-row justify-between w-full items-center gap-2"
                    >
                        <div>
                            <p class="text-lait-yellow font-bold text-xs">
                                {{ comment.username }}
                            </p>

                            <p class="text-xs">
                                {{ comment.content }}
                            </p>
                        </div>
                        <div
                            v-if="comment.user_id === user.id"
                            class="cursor-pointer text-lait-grey mr-4"
                            @click="deleteUserComment(comment.comment_id)"
                        >
                            x
                        </div>
                    </div>
                </div>
                <p
                    class="flex flex-end justify-end mr-4 font-bold text-[10px] text-lait-yellow"
                >
                    {{ formatCommentDate(comment.created_at) }}
                </p>

                <hr
                    class="my-5 text-center w-60 h-0.5 border-lait-grey opacity-30 mx-auto"
                />
            </li>
        </ul>

        <form @submit.prevent="sendComment" class="flex flex-row">
            <div class="relative w-full">
                <textarea
                    class="py-2 h-24 px-3 w-full bg-[#87A3AA] text-white focus:outline-none placeholder-white flex-grow"
                    type="text"
                    placeholder="Skriv din kommentar her"
                    v-model="commentFromUser"
                />
                <button
                    class="text-white pl-1.5 absolute right-4 bottom-4 bg-[#87A3AA]"
                    type="submit"
                >
                    Send
                </button>
            </div>
        </form>
    </div>
</template>
