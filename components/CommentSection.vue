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
        .on("INSERT", (payload) => {
            comments.value.push(payload.new);
        })
        .subscribe();
    return () => supabase.removeSubscription(subscription);
});

watch(comments, () => {
    comments.value.forEach((comment) => {
        comment.user_id;
    });
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

const getProfile = async () => {
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
getProfile();
</script>

<template>
    <div>
        <ul>
            <li v-for="comment in displayComments" :key="comment.id">
                <div class="flex gap-4">
                    <p>
                        {{ comment.username }}
                    </p>

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
