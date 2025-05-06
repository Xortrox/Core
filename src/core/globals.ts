declare global {
    interface Window {
        [key: string]: any,
    }

    interface Document {
        highlite: {
            [key: string]: any,
        }
    }
}