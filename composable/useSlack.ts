import { useDateFormatter } from "@/composable/useDateFormatter";
const { formatDate } = useDateFormatter();
const config = useRuntimeConfig();

export function useSlack() {
    const postEventOnSlack = async (
        eventTitle: string,
        eventDescription: string,
        selectedDeadline: string
    ) => {
        fetch(config.public.slackUrl, {
            mode: "no-cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `Der er oprettet et nyt event: *${eventTitle}* :party_blob:`,
                        },
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `${eventDescription}`,
                        },
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "plain_text",
                                text: `:clock3: Sidste tilmeldingsfrist: ${formatDate(
                                    selectedDeadline
                                )}`,
                                emoji: true,
                            },
                        ],
                    },
                ],
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    return { postEventOnSlack };
}
