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

    const getDeadlineDate = (date) => {
        const formattedDate = new Date(date - 1 * 24 * 60 * 60 * 1000);

        return formattedDate.toLocaleString("Da-DK", {
            day: "numeric",
            weekday: "long",
            month: "long",
        });
    };

    return { formatDate, formatTime, getDeadlineDate };
}
