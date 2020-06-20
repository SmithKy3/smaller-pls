import { downsample } from './downsamplers/AreaAverage';

export async function downscale(
  original: HTMLImageElement,
  desiredWidth: number,
  desiredHeight: number
): Promise<OffscreenCanvas> {
  const { width: ogWidth, height: ogHeight } = original;

  if (desiredWidth > ogWidth || desiredHeight > ogHeight) {
    throw new Error('Original image is smaller than desired size');
  }

  if (desiredWidth === ogWidth && desiredHeight === ogHeight) {
    const canvas = new OffscreenCanvas(desiredWidth, desiredHeight);
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(original, 0, 0);
    return canvas;
  }

  const loadingCanvas = new OffscreenCanvas(desiredWidth, desiredHeight);
  const loadingContext = loadingCanvas.getContext('2d');

  downsample(original, desiredWidth, desiredHeight).then((data) =>
    loadingContext!.putImageData(data, 0, 0)
  );

  return loadingCanvas;
}
