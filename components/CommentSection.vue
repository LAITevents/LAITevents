<script setup lang="ts">
import { ref } from "vue";
import IComments from "@/interfaces/comments";
import { useUser } from "~/composable/useUser";

const props = defineProps({
    comments: { type: Object as () => IComments[], default: [] },
    currentId: { type: String },
});

const { getUsername } = useUser();
const supabase = useSupabaseClient();
const comments = ref(props.comments);
const commentFromUser = ref("");
const user = supabase.auth.user();

watchEffect(async () => {
    const subscription = supabase
        .from("comments")
        .on("INSERT", (payload) => {
            comments.value.push(payload.new);
        })
        .subscribe();
    return () => supabase.removeSubscription(subscription);
});

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

const getUsernameForComment = async (user_id: string) => {
    let username = "";
    username = await getUsername(user_id);
    return username;
};
</script>

<template>
    <div>
        <ul>
            <li v-for="comment in comments" :key="comment.id">
                <div class="flex gap-4">
                    <p>{{ getUsernameForComment(comment.user_id) }}</p>

                    <p>{{ comment.content }}</p>
                </div>
            </li>
        </ul>

        <form @submit.prevent="sendComment">
            <input
                class="text-black"
                type="text"
                placeholder="Skriv din kommentar her"
                v-model="commentFromUser"
            />
            <button type="submit">Send</button>
        </form>
    </div>
</template>
