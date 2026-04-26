'use client'
import { useState } from "react";

const returnInitialState = (storageKey: string, initialState: unknown) => {
    try {
        const items = window.localStorage.getItem(storageKey);
        return items ? JSON.parse(items) : initialState;
    }
    catch {
        return initialState;
    }
}


export const useLocalStorage = (storageKey: string, initialState: unknown) => {
    const [storedValue, setStoredValue] = useState(
        returnInitialState(storageKey, initialState)
    )

    const setValue = (value: unknown) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            window.localStorage.setItem(storageKey, typeof value === "number" ? valueToStore : JSON.stringify(valueToStore))

            setStoredValue(valueToStore);
        }
        catch (error) {
            console.log(error)
        }
    };

    return [storedValue, setValue]
}