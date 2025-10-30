import { storage } from "@wxt-dev/storage";

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

interface loadConfigFromStorageType {
    ankiConnectUrl: string;
    aporaBrowserEnabled: boolean;
    ankiDeckName: string | null;
    aporaAPIToken: string | null;
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

    await setFn({
        ankiConnectUrl: _ankiConnectUrl,
        aporaBrowserEnabled: _aporaBrowserEnabled,
        ankiDeckName: _ankiDeckName,
        aporaAPIToken: _aporaAPIToken,
    });
};
