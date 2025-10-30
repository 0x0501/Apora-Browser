import { expect, test } from "bun:test";
import { addNoteToDeck, listDecks } from "../utils/operation";

test("Should listDecks works properly", async () => {
    if (process.env.ANKI_CONNECT_URL) {
        const result = await listDecks({
            ankiConnectUrl: process.env.ANKI_CONNECT_URL,
        });
        expect(result.success).toBeTrue();
        expect(result.data).toBeArray();
        expect(result.data?.length).toBeGreaterThan(0);
    } else {
        throw Error("process.env.ANKI_CONNECT_URL is undefined.");
    }
});

test("Should addNoteToDeck return note id", async () => {
    if (process.env.ANKI_CONNECT_URL) {
        const result = await addNoteToDeck({
            ankiConnectUrl: process.env.ANKI_CONNECT_URL,
            note: {
                deckName: "Default",
                modelName: "Apora-English",
                fields: {
                    Sentence: `This is a test sentence: ${crypto.randomUUID()}`,
                    Word: crypto.randomUUID(),
                    Definition: "Test ...",
                },
                tags: ["test"],
            },
        });

        if (result.success === false) {
            console.error(result.message);
        }

        expect(result.success).toBeTrue();
        expect(result.data).toBeNumber();
    } else {
        throw Error("process.env.ANKI_CONNECT_URL is undefined.");
    }
});
