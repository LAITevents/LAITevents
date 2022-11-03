export function useUser() {
    const supabase = useSupabaseClient();

    const getUsername = async (userId) => {
        const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", userId);
        return profile[0].username;
    };

    const getProfileData = async (userId) => {
        const { data: userdata } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId);
        return userdata[0];
    };

    return { getUsername, getProfileData };
}
