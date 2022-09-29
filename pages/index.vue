<script setup lang="ts">
import { useDashify } from "@/composable/dashify";
import { ref } from "vue";
definePageMeta({
	middleware: "auth",
});
const user = useSupabaseUser();
</script>

<template>
	<div>
		<p class="text-2xl">
			Hello
			<span class="text-lait-yellow text-2xl">{{
				user?.user_metadata.user_name || user?.email
			}}</span>
		</p>

		<EventCard />
	</div>
</template>
