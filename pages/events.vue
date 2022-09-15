<template>
	<div>
		<p>Hello {{ user?.email }}</p>
		<h1 class="text-xl">Events here</h1>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
});
const user = useSupabaseUser();
</script>
