export function useUser() {
    const supabase = useSupabaseClient();

    const getUsername = async (userId) => {
        const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", userId);
        return profile[0].username;
    };

    return { getUsername };
}
