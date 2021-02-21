import * as Types from './types';
import allDownsamplers from './downsamplers';
import * as helpers from './helpers';

export enum DownsampleMethods {
  areaAverage = 'AREA_AVERAGE',
  nearestNeighbor = 'NEAREST_NEIGHBOR',
};

type DownsamplerKeys = (typeof DownsampleMethods)[keyof typeof DownsampleMethods];
const Downsamplers: Record<DownsamplerKeys, Types.downsampleFn> = {
  [DownsampleMethods.areaAverage]: allDownsamplers.areaAverage,
  [DownsampleMethods.nearestNeighbor]: allDownsamplers.nearestNeighbor,
};


/**
 * @async
 * @function downscale - Takes an image (either as an element or as a base64 encoded string) and resizes it using the specified downsampling algorithm.
 *                        Defaults to area-average. Returns a base64 string.
 * 
 * @param {(HTMLImageElement|string)} original - The original image, acceptable as a HTMLImageElement or as a base64 string.
 * @param {number} desiredWidth - The desired resulting width, in pixels.
 * @param {number} desiredHeight - The desired resulting height, in pixels.
 * @param {string} [method] - The key of the desired downsampling method. Import DownsampleMethods to access allowed keys.
 * 
 * @returns {Promise<string>} - The downscaled image in base64 encoded format (PNG).
 */
export async function downscale(
  original: HTMLImageElement | string,
  desiredWidth: number,
  desiredHeight: number,
  method: DownsampleMethods = DownsampleMethods.areaAverage
): Promise<string> {
  let image: HTMLImageElement;

  if (helpers.isString(original)) {
    const isValidBase64 = helpers.isBase64(original);
    if (!isValidBase64) {
      console.error('smaller-pls: String passed could not be decoded, it must be a valid base64 encoded string. Image downscaling aborted.');
      return original;
    }

    image = await helpers.getLoadedImage(original);
  } else {
    image = original;
  }

  const loadingCanvas = helpers.getSizedCanvas(desiredWidth, desiredHeight);
  const loadingContext = loadingCanvas.getContext('2d');

  const { width: originalWidth, height: originalHeight } = image;
  if (desiredWidth > originalWidth || desiredHeight > originalHeight) {
    if (desiredWidth === originalWidth && desiredHeight === originalHeight) {
      console.error("smaller-pls: Original image dimensions and desired dimensions are identical. Original image was returned in base64 format without any manipulation.");
    } else {
      console.error("smaller-pls: Original image dimensions are smaller than desired dimensions. This library does not handle upscaling (yet). Image has been returned using HTML5 canvas' native upscaling.");
    }

    if (helpers.isString(original)) {
      return original;
    } else {
      loadingCanvas.width = desiredWidth;
      loadingCanvas.height = desiredHeight;
      loadingContext!.drawImage(image, 0, 0, desiredWidth, desiredHeight);
      return loadingCanvas.toDataURL();
    }
    
  }

  const imageData = await Downsamplers[method](image, desiredWidth, desiredHeight);
  loadingContext!.putImageData(imageData, 0, 0);
  return loadingCanvas.toDataURL();
}
