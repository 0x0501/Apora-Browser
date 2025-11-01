import { storage } from "@wxt-dev/storage";
import type z from "zod";
import type { PronunciationVariant } from "@/utils/schema";

export const ankiConnectUrlStorage = storage.defineItem<string>(
    "local:ankiConnectUrl",
    { fallback: "http://127.0.0.1:8765" }, // default Anki connect url
);

export const ankiDeckNameStorage = storage.defineItem<string>(
    "local:ankiDeckName", // no fallback value
);

export const aporaAPITokenStorage = storage.defineItem<string>(
    "local:aporaAPIToken", // no fallback value
);

export const aporaBrowserEnabledStorage = storage.defineItem<boolean>(
    "local:aporaBrowserEnabled",
    { fallback: true },
);

export const enablePronunciationStorage = storage.defineItem<boolean>(
    "local:enablePronunciation",
    { fallback: false },
);

export const pronunciationVariantStorage = storage.defineItem<
    z.infer<typeof PronunciationVariant>
>(
    "local:pronunciationVariant",
    { fallback: "US" },
);

export const enableTermHighlightingStorage = storage.defineItem<boolean>(
    "local:enableTermHighlighting",
    { fallback: true },
);

export const addPartOfSpeechToTagStorage = storage.defineItem<boolean>(
    "local:addPartOfSpeechToTag",
    { fallback: true },
);

interface loadConfigFromStorageType {
    ankiConnectUrl: string;
    aporaBrowserEnabled: boolean;
    ankiDeckName: string | null;
    aporaAPIToken: string | null;
    enablePronunciation: boolean;
    pronunciationVariant: z.infer<typeof PronunciationVariant>;
    enableTermHighlighting: boolean;
    addPartOfSpeechToTag: boolean;
}

export const loadConfigFromStorage = async (
    setFn: (
        { ankiConnectUrl, aporaBrowserEnabled, ankiDeckName, aporaAPIToken }:
            loadConfigFromStorageType,
    ) => void | Promise<void>,
) => {
    const _ankiConnectUrl = await ankiConnectUrlStorage.getValue();
    const _ankiDeckName = await ankiDeckNameStorage.getValue();
    const _aporaAPIToken = await aporaAPITokenStorage.getValue();
    const _aporaBrowserEnabled = await aporaBrowserEnabledStorage.getValue();
    const _enablePronunciation = await enablePronunciationStorage.getValue();
    const _pronunciationVariant = await pronunciationVariantStorage
        .getValue();
    const _enableTermHighlighting = await enableTermHighlightingStorage
        .getValue();
    const _addPartOfSpeechToTag = await addPartOfSpeechToTagStorage.getValue();

    await setFn({
        ankiConnectUrl: _ankiConnectUrl,
        aporaBrowserEnabled: _aporaBrowserEnabled,
        ankiDeckName: _ankiDeckName,
        aporaAPIToken: _aporaAPIToken,
        enablePronunciation: _enablePronunciation,
        pronunciationVariant: _pronunciationVariant,
        enableTermHighlighting: _enableTermHighlighting,
        addPartOfSpeechToTag: _addPartOfSpeechToTag,
    });
};
