export function isString(arg: any): arg is string {
    return arg.constructor === String.prototype.constructor;
}

export function isBase64(str: string): boolean {
    if (str  === '' || str.trim() === '') return false;

    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}

export async function getLoadedImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new HTMLImageElement();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(img);
    });
}

export function getSizedCanvas(w: number, h: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
}