export function useUser() {
    const supabase = useSupabaseClient();

    const getUsername = async (userId) => {
        const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", userId);
        return profile[0];
    };

    return { getUsername };
}
