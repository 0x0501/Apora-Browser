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
                (i) => ({ key: i, label: i } as DeckItem),
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

export type NoteMedia<K extends string> = {
    url: string;
    filename: string;
    skipHash: string;
    fields: K[];
};

export type Note<K> = {
    deckName: string;
    modelName: string;
    fields: K;
    tags?: string[];
    audio?: NoteMedia<keyof K & string>[];
    video?: NoteMedia<keyof K & string>[];
    picture?: NoteMedia<keyof K & string>[];
};

type addNoteToDeckParams<K extends Record<string, string>> = {
    ankiConnectUrl: string;
    note: Note<K>;
};

export async function addNoteToDeck<K extends Record<string, string>>({
    ankiConnectUrl,
    note,
}: addNoteToDeckParams<K>): Promise<OperationResponseBase<number>> {
    try {
        const res = await fetch(ankiConnectUrl, {
            method: "POST",
            body: JSON.stringify({
                action: "addNote",
                version: 6,
                params: {
                    note: {
                        ...note,
                    },
                },
            }),
        });

        const resJson = (await res.json()) as AnkiConnectResponseBaseType<
            number
        >;

        if (!resJson.error) {
            return {
                success: true,
                message: null,
                data: resJson.result,
            };
        } else {
            return {
                success: false,
                message: resJson.error,
                data: null,
            };
        }
    } catch (err) {
        console.error(String(err));
        return {
            success: false,
            message: String(err),
            data: null,
        };
    }
}
