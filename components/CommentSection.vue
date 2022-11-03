<script setup lang="ts">
import { ref } from "vue";
import IComments from "@/interfaces/comments";
import { useUser } from "~/composable/useUser";

const props = defineProps({
    comments: { type: Object as () => IComments[], default: [] },
    currentId: { type: String },
});

const { getProfileData } = useUser();
const supabase = useSupabaseClient();
const commentFromUser = ref("");
const user = supabase.auth.user();
const comments = ref(props.comments);

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

// const getUserdataFromSupabase = async (userId) => {
//     try {
//         const { data: userdata, error } = await supabase
//             .from("profiles")
//             .select("*")
//             .eq("id", userId);
//         if (error) throw error;
//     } catch (error) {
//         console.log(error);
//     }
// };

const getUserData = async (userid) => {
    const users = [];

    const data = await getProfileData(userid);
    data.forEach(async (user) => {
        users.push(user);
    });

    console.log(users);
};
</script>

<template>
    <div>
        <ul>
            <li v-for="comment in comments" :key="comment.id">
                <div class="flex gap-4">
                    <p>
                        {{ getUserData(comment.user_id) }}
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
