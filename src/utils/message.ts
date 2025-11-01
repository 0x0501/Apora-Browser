/** biome-ignore-all lint/suspicious/noExplicitAny: We need any to embrace all the possible actions */

import type { OperationResponseBase } from "./operation";

type AllFunctions<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K]
        : never;
};

export function defineMessage<P extends AllFunctions<P>>() {
    async function sendMessage<
        A extends keyof P & string,
        B extends P[A] & P[A] extends (...args: any[]) => any
            ? Parameters<P[A]>[number]
            : never,
        C extends P[A] & P[A] extends (...args: any[]) => any ? ReturnType<P[A]>
            : never,
    >(
        action: A,
        payload: B,
    ): Promise<C> {
        const response = await browser.runtime.sendMessage<
            { action: A; payload: B },
            ReturnType<C>
        >({
            action,
            payload,
        });

        return response;
    }

    function onMessage<
        A extends keyof P & string,
        B extends P[A] & P[A] extends (...args: any[]) => any
            ? Parameters<P[A]>[number]
            : never,
        V extends P[A] & P[A] extends (...args: any[]) => any ? ReturnType<P[A]>
            : never,
    >(action: A, callback: (parameters: B) => Promise<Awaited<V>>) {
        browser.runtime.onMessage.addListener(
            (request, _sender, sendResponse) => {
                if (request.action === action) {
                    (async () => {
                        const result = await callback(request.payload);
                        sendResponse(result);
                    })();
                    return true;
                }
            },
        );
    }

    return {
        sendMessage,
        onMessage,
    };
}

/**
 * @description The dictionary data return from Apora.
 */
export type DictDataReturnType = {
    partOfSpeech: string;
    original: string;
    meaning: string;
    chineseMeaning: string;
    pronunciationVariant: "US" | "GB";
    ipa: string;
    context?: string; // if `context` enabled
    replacing?: string; // if `context` enabled
    fileNameTag?: string; // if `pronunciation` enabled
};

export type getDictDataReturnType = Promise<OperationResponseBase<DictDataReturnType>>;

export interface MessageProtocol {
    getDictData(
        payload: {
            inquire: string;
            fullText: string;
        },
    ): getDictDataReturnType;
}

export const { sendMessage, onMessage } = defineMessage<MessageProtocol>();
