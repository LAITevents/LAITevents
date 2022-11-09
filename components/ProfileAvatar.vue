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
        const filePath = uuidv4();
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
        <img v-if="src" :src="src" />
        <svg
            v-else
            viewBox="0 0 310 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="2.5"
                y="2.5"
                width="304.926"
                height="295"
                stroke="#4C757F"
                stroke-width="5"
                stroke-dasharray="10 10"
            />
            <path
                d="M216.176 159.151V186.874C216.176 194.435 209.905 200.735 202.378 200.735H107.548C100.022 200.735 93.75 194.435 93.75 186.874V159.151C93.75 157.135 95.5061 155.371 97.5131 155.371C99.5201 155.371 101.276 157.135 101.276 159.151V186.874C101.276 190.402 104.036 193.174 107.548 193.174H202.378C205.891 193.174 208.65 190.402 208.65 186.874V159.151C208.65 157.135 210.406 155.371 212.413 155.371C214.42 155.371 216.176 156.883 216.176 159.151ZM162.24 101.186C160.233 99.1697 157.473 98.1616 154.965 98.1616C152.456 98.1616 149.696 99.1697 147.689 101.186L130.128 118.828C128.623 120.34 128.623 122.608 130.128 124.12C131.633 125.632 133.891 125.632 135.397 124.12L151.202 108.243V169.99C151.202 172.006 152.958 173.77 154.965 173.77C156.972 173.77 158.728 172.006 158.728 169.99V108.496L174.533 124.373C176.038 125.886 178.296 125.886 179.801 124.373C181.306 122.861 181.306 120.593 179.801 119.081L162.24 101.186Z"
                fill="#D9D9D9"
            />
        </svg>
        <div style="position: relative">
            <label class="" for="single">
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
