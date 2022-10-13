export function useDateFormatter() {
    const formatDate = (date) => {
        const formattedDate = new Date(date);

        return formattedDate.toLocaleString("Da-DK", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (date) => {
        const formattedDate = new Date(date);

        return formattedDate.toLocaleTimeString("da");
    };

    return { formatDate, formatTime };
}
