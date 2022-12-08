import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import * as locale from "dayjs/locale/da";

export function useDateFormatter() {
    const formatDate = (date: string) => {
        const formattedDate = new Date(date);

        return formattedDate.toLocaleString("Da-DK", {
            day: "numeric",
            weekday: "long",
            month: "long",
        });
    };

    const formatTime = (date: string) => {
        const formattedDate = new Date(date);

        return formattedDate
            .toLocaleTimeString("da", {
                timeStyle: "short",
            })
            .replace(".", ":");
    };

    const formatDeadlineDate = (date: string) => {
        const newDate = new Date(date);
        return newDate;
    };

    const formatCommentDate = (date: string) => {
        dayjs.extend(relativeTime);
        const formattedDate = dayjs(date).locale(locale).fromNow();
        return formattedDate;
    };

    return { formatDate, formatTime, formatDeadlineDate, formatCommentDate };
}
