export const iterate = (obj: any) => {
    Object.keys(obj).forEach(key => {

        if (typeof obj[key] === "string" && obj[key].includes("https://api.github.com/")) {
            delete obj[key];
        }

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            iterate(obj[key])
        }
    })
}