export function useEvent() {
    const supabase = useSupabaseClient();

    let currentDate = new Date().toISOString();

    const getData = async () => {
        try {
            const { data: eventData, error } = await supabase
                .from("events")
                .select("*, category_id(*)")
                .gt("selected_date", currentDate)
                .order("selected_date", { ascending: true });
            if (error) throw error;
            return eventData;
        } catch (error) {
            console.warn(error);
        }
    };

    const getEventsForUser = async (userId?: string) => {
        const { data: events } = await supabase
            .from("events")
            .select("id, title")
            .gt("selected_date", currentDate)
            .eq("userId", userId);
        return events;
    };

    const getPastEventsForUser = async (userId?: string) => {
        const { data: events } = await supabase
            .from("events")
            .select("id, title")
            .lt("selected_date", currentDate)
            .eq("userId", userId);
        return events;
    };

    return { getEventsForUser, getData, getPastEventsForUser };
}
