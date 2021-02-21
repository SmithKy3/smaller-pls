import * as Types from '../types';
import * as helpers from '../helpers';

// AreaAverage algorithm
export const areaAverage: Types.downsampleFn = async (
  img: HTMLImageElement,
  desiredWidth: number,
  desiredHeight: number
) => {
  const canvas = helpers.getSizedCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx!.drawImage(img, 0, 0);
  const sourceData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

  const { width, height, data } = sourceData;
  const sampleWidth = Math.round(width / desiredWidth); // Need these to be integers
  const sampleHeight = Math.round(height / desiredHeight);
  const resultWidth = Math.round(sourceData.width / sampleWidth);
  const resultHeight = Math.round(sourceData.height / sampleHeight);
  const sampleArea = sampleWidth * sampleHeight;

  const pixelBuffer = [];

  for (let resultY = 0; resultY++ < resultHeight; ) {
    for (let resultX = 0; resultX++ < resultWidth; ) {
      const sourceStartIndex =
        (resultX * sampleWidth + resultY * sampleHeight * width) * 4;

      let R = 0;
      let G = 0;
      let B = 0;
      let A = 0;

      for (let sourceY = 0; sourceY++ < sampleHeight; ) {
        for (let sourceX = 0; sourceX++ < sampleWidth; ) {
          const i = sourceStartIndex + (sourceX + sourceY * width) * 4;
          R += data[i];
          G += data[i + 1];
          B += data[i + 2];
          A += data[i + 3];
        }
      }

      R /= sampleArea;
      G /= sampleArea;
      B /= sampleArea;
      A /= sampleArea;

      pixelBuffer.push(R, G, B, A);
    }
  }

  const resultData = new ImageData(resultWidth, resultHeight);
  resultData.data.set(pixelBuffer);

  return resultData;
}
