<script setup>
import { v4 as uuidv4 } from "uuid";
const props = defineProps(["path", "showUpload"]);
const { path, showUpload } = toRefs(props);
const emit = defineEmits(["update:path", "upload"]);
const supabase = useSupabaseClient();

const uploading = ref(false);
const src = ref("");
const files = ref();

const downloadImage = async () => {
    try {
        const { data, error } = await supabase.storage
            .from("avatars")
            .getPublicUrl(path.value);
        if (error) throw error;
        src.value = data.publicURL;
    } catch (error) {
        console.error("Error downloading image: ", error.message);
    }
};

const uploadAvatar = async (evt) => {
    files.value = evt.target.files;
    try {
        uploading.value = true;
        if (!files.value || files.value.length === 0) {
            throw new Error("You must select an image to upload.");
        }
        const file = files.value[0];
        const filePath = uuidv4();
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);
        if (uploadError) throw uploadError;
        emit("update:path", filePath);
        emit("upload");
    } catch (error) {
        console.log(error.message);
    } finally {
        uploading.value = false;
    }
};

downloadImage();

watch(path, () => {
    if (path.value) {
        downloadImage();
    }
});
</script>

<template>
    <label for="single" class="flex flex-col">
        <img v-if="path" :src="src" class="object-cover lg:h-72" />
        <img v-else src="@/assets/placeholder.jpg" class="h-72 object-cover" />

        <div v-if="props.showUpload">
            <input
                class="absolute hidden"
                type="file"
                id="single"
                accept="image/*"
                @change="uploadAvatar"
                :disabled="uploading"
            />
            <p
                class="uppercase font-bold text-lait-grey text-[8px] text-center mt-2 lg:text-xs"
            >
                {{
                    uploading
                        ? "Uploading ..."
                        : "klik her for at uploade billede"
                }}
            </p>
        </div>
    </label>
</template>
