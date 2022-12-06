export function useUser() {
    const supabase = useSupabaseClient();

    const getUsername = async (userId: string) => {
        const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", userId);
        return profile[0];
    };

    const getProfileInformation = async (user_id: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user_id);
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.log(error);
        }
    };

    return { getUsername, getProfileInformation };
}
