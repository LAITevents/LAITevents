export function useCategories() {
    const supabase = useSupabaseClient();

    const getCategoriesFromDb = async () => {
        try {
            const { data: categories, error } = await supabase
                .from("categories")
                .select("*");
            if (error) throw error;
            return categories;
        } catch (error) {
            console.log(error.message);
        }
    };

    return { getCategoriesFromDb };
}
