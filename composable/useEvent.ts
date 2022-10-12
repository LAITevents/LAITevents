export function useEvent() {
	const supabase = useSupabaseClient();

	const getEvents = async (userId?) => {
		const { data: events } = await supabase
            .from("events")
            .select()
            .eq("userId", userId)
		return events;
	};

	return { getEvents };
}
