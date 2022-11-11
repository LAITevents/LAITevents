<script setup lang="ts">
const supabase = useSupabaseClient();
const props = defineProps({
    events: { type: Object },
});
</script>

<template>
    <div>
        <p>#FEST</p>
    </div>
</template>
