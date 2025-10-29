import type { Dispatch, SetStateAction } from "react";

export function useSetStateWithStorage<S>(
    action: Dispatch<SetStateAction<S>>,
    item: WxtStorageItem<S, Record<string, unknown>>,
) {
    function setStateAndUpdateStorage(v: S) {
        action(v); // update state
        item.setValue(v); // update storage
    }

    return setStateAndUpdateStorage;
}
