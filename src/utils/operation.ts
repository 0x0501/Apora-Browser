export interface OperationResponseBase<T> {
    success: boolean;
    message: string | null;
    data: T | null;
}

export type DeckItem = {
    key: string;
    label: string;
};

export type ListDecksReturnType = DeckItem[];

export interface AnkiConnectResponseBaseType<T> {
    error: string | null;
    result: T;
}

export async function listDecks(
    { ankiConnectUrl }: { ankiConnectUrl: string },
): Promise<OperationResponseBase<ListDecksReturnType>> {
    try {
        const res = await fetch(ankiConnectUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "deckNames",
                version: 6,
            }),
        });

        const resJson = await res.json() as AnkiConnectResponseBaseType<
            string[]
        >;

        if (!resJson.error) {
            const deckItems = resJson.result.map(
                (i) => ({ key: i, label: i } as DeckItem)
            );
            return {
                success: true,
                message: null,
                data: deckItems,
            };
        } else {
            return {
                success: false,
                message: resJson.error,
                data: null,
            };
        }
    } catch (err) {
        return {
            success: false,
            message: String(err),
            data: null,
        };
    }
}
