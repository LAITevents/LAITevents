export function useUser() {
	const supabase = useSupabaseClient();

	const getUsername = async (userId) => {
		const { data: profiles } = await supabase
			.from("profiles")
			.select("username")
			.eq("id", userId);
		return profiles[0].username;
	};

	return { getUsername };
}
