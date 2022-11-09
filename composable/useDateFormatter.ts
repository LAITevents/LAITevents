export function useDateFormatter() {
    const formatDate = (date) => {
        const formattedDate = new Date(date);

        return formattedDate.toLocaleString("Da-DK", {
            day: "numeric",
            weekday: "long",
            month: "long",
        });
    };

    const formatTime = (date) => {
        const formattedDate = new Date(date);

        return formattedDate
            .toLocaleTimeString("da", {
                timeStyle: "short",
            })
            .replace(".", ":");
    };
    return { formatDate, formatTime };
}
