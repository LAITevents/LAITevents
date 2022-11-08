<script setup>
import { v4 as uuidv4 } from "uuid";
const props = defineProps(["path"]);
const { path } = toRefs(props);
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
        const filePath = uuidv4() + "-" + file.name;
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);
        if (uploadError) throw uploadError;
        emit("update:path", filePath);
        emit("upload");
    } catch (error) {
        alert(error.message);
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
    <div>
        <img v-if="src" :src="src" class="w-[300px] h-[300px]" />

        <div style="width: 10em; position: relative">
            <label class="block button primary" for="single">
                {{ uploading ? "Uploading ..." : "Upload" }}
            </label>
            <input
                style="position: absolute; visibility: hidden"
                type="file"
                id="single"
                accept="image/*"
                @change="uploadAvatar"
                :disabled="uploading"
            />
        </div>
    </div>
</template>
