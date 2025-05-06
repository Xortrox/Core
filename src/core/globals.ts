declare global {
    interface Window {
        [key: string]: any,
    }

    interface Document {
        highlite: {
            plugins: {
                [key: string]: any,
            }
            [key: string]: any,
        }
    }
}