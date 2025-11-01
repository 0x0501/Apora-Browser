import { type getDictDataReturnType, onMessage } from "@/utils/message";

function sendNotification(
    { title, message }: { title: string; message: string },
) {
    // send notifications
    browser.notifications.create({
        type: "basic",
        title: title,
        message: message,
        iconUrl: browser.runtime.getURL("/icon/icon.png")
    });
}

export default defineBackground(() => {
    onMessage("getDictData", async ({ inquire, fullText }) => {
        const API_TOKEN = await aporaAPITokenStorage.getValue();
        const API_ENDPOINT = `https://apora.sumku.cc/api/dict`;

        if (!API_TOKEN) {
            return {
                success: false,
                message: "Apora API Token is empty.",
                data: null,
            };
        }

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${API_TOKEN}`);

        console.log("Send.................")

        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers,
            signal: AbortSignal.timeout(1000 * 60 * 2), // set 2mins as timeout
            body: JSON.stringify({
                inquire,
                fullText,
            }),
        });


        if (response.status === 200) {
            const resJson: Awaited<getDictDataReturnType> = await response
                .json();

            if (resJson.success && resJson.data) {
                sendNotification({
                    title: "Apora Browser",
                    message: "Successfully added 1 note.",
                });
                return {
                    success: true,
                    message: null,
                    data: resJson.data,
                };
            } else {
                sendNotification({
                    title: "Apora Browser",
                    message: `Occurred error ${String(resJson.message)}.`,
                });
                return {
                    success: false,
                    message: JSON.stringify(resJson.message),
                    data: null,
                };
            }
        } else {
            const errorRes = await response.json();
            sendNotification({
                title: "Apora Browser",
                message: `Occurred error ${String(errorRes)}.`,
            });
            return {
                success: false,
                message: JSON.stringify(errorRes),
                data: null,
            };
        }
    });

    console.log("Hello background!", { id: browser.runtime.id });
});
