export function useEvent() {
    const supabase = useSupabaseClient();

    const getData = async () => {
        try {
            const { data: eventData, error } = await supabase
                .from("events")
                .select("*, category_id(*)");
            if (error) throw error;
            return eventData;
        } catch (error) {
            console.warn(error.message);
        }
    };

    const getEventsForUser = async (userId?, date?) => {
        const { data: events } = await supabase
            .from("events")
            .select("id, title")
            .gt("selected_date", date)
            .eq("userId", userId);
        return events;
    };

    const getPastEventsForUser = async (date?) => {
        const { data: events } = await supabase
            .from("events")
            .select("id, title")
            .lt("selected_date", date);
        return events;
    };

    const getDepartment = async (teamId?) => {
        const { data: team } = await supabase
            .from("teams")
            .select("team_title")
            .eq("id", teamId);
        return team;
    };

    return { getEventsForUser, getDepartment, getData, getPastEventsForUser };
}
