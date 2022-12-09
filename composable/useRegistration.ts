export function useRegistration() {
    const supabase = useSupabaseClient();

    const registerEvent = async (currentId: number, userId?: string) => {
        try {
            const { error } = await supabase.from("event_participants").insert({
                event_id: currentId,
                user_id: userId,
            });
            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUserRegistration = async (
        currentId: number,
        userId?: string
    ) => {
        try {
            const { error } = await supabase
                .from("event_participants")
                .delete()
                .match({ event_id: currentId, user_id: userId })
                .select();
            if (error) throw error;
        } catch (error) {
            console.log(error);
        }
    };

    return { registerEvent, deleteUserRegistration };
}
