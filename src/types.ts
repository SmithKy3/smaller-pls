export type downsampleFn = (
    img: HTMLImageElement,
    desiredWidth: number,
    desiredHeight: number
) => Promise<ImageData>;