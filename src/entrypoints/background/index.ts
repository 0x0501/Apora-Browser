import { type getDictDataReturnType, onMessage } from "@/utils/message";

function sendNotification(
    { title, message }: { title: string; message: string },
) {
    // send notifications
    browser.notifications.create({
        type: "basic",
        title: title,
        message: message,
        iconUrl: browser.runtime.getURL("/icon/icon.png"),
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

        // fetch dictionary data from Apora
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
                // add note to Anki
                const ankiConnectUrl = await ankiConnectUrlStorage.getValue();
                const deckName = await ankiDeckNameStorage.getValue();
                const addTag = await addPartOfSpeechToTagStorage.getValue();
                const highlight = await enableTermHighlightingStorage
                    .getValue();

                if (!deckName) {
                    console.error(
                        `[Apora Browser.ankiConnect] 'deckName' cannot be empty"`,
                    );
                    return {
                        success: false,
                        message: "`deckName` cannot be empty",
                        data: null,
                    };
                }

                const ankiConnectResponse = await addNoteToDeck({
                    ankiConnectUrl,
                    note: {
                        deckName: deckName,
                        modelName: "Apora-English",
                        fields: {
                            Sentence: highlight
                                ? fullText.replace(
                                    inquire,
                                    `<span style="font-weight: bold; color: #4096ff;">${inquire}</span>`,
                                )
                                : fullText, // highlight inquiring word
                            Word: resJson.data.original,
                            Phonetics: resJson.data.ipa,
                            Definition: resJson.data.meaning,
                            Chinese_Definition: resJson.data.chineseMeaning,
                        },
                        tags: addTag ? [resJson.data.partOfSpeech] : [],
                    },
                });

                if (!ankiConnectResponse.success) {
                    sendNotification({
                        title: "Apora Browser",
                        message: `Occurred error ${
                            JSON.stringify(ankiConnectResponse.message)
                        }.`,
                    });
                    console.error(
                        `[Apora Browser.ankiConnect] ${
                            JSON.stringify(ankiConnectResponse.message)
                        }`,
                    );
                    return {
                        success: false,
                        message: ankiConnectResponse.message,
                        data: null,
                    };
                } else {
                    sendNotification({
                        title: "Apora Browser",
                        message: "Successfully added 1 note.",
                    });
                    return {
                        success: true,
                        message: null,
                        data: resJson.data,
                    };
                }
            } else {
                sendNotification({
                    title: "Apora Browser",
                    message: `Occurred error ${
                        JSON.stringify(resJson.message)
                    }.`,
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
                message: `Occurred error ${JSON.stringify(errorRes)}.`,
            });
            return {
                success: false,
                message: JSON.stringify(errorRes),
                data: null,
            };
        }
    });
});
