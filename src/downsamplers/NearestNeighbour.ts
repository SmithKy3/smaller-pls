// Nearest Neighbour algorithm
export async function downsample(
  img: HTMLImageElement,
  desiredWidth: number,
  desiredHeight: number
): Promise<ImageData> {
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx!.drawImage(img, 0, 0);
  const sourceData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

  const { width, height, data } = sourceData;
  const sampleWidth = Math.round(width / desiredWidth); // Need these to be integers
  const sampleHeight = Math.round(height / desiredHeight);
  const resultWidth = Math.round(sourceData.width / sampleWidth);
  const resultHeight = Math.round(sourceData.height / sampleHeight);

  let R = 0;
  let G = 0;
  let B = 0;
  let A = 0;
  const pixelBuffer = [];

  for (let resultY = 0; resultY++ < resultHeight; ) {
    for (let resultX = 0; resultX++ < resultWidth; ) {
      const sourceStartIndex =
        (resultX * sampleWidth + resultY * sampleHeight * width) * 4;

      const i = sourceStartIndex + (sampleWidth + sampleHeight * width) * 4;

      R = data[i];
      G = data[i + 1];
      B = data[i + 2];
      A = data[i + 3];

      pixelBuffer.push(R, G, B, A);
    }
  }

  const resultData = new ImageData(resultWidth, resultHeight);
  resultData.data.set(pixelBuffer);

  return resultData;
}

// const canvas = new OffscreenCanvas(img.width, img.height);
// const ctx = canvas.getContext('2d');
// ctx!.drawImage(img, 0, 0);
// const sourceData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

// const xRatio = desiredWidth / img.width;
// const yRatio = desiredHeight / img.height;
// const xStep = Math.floor(1 / xRatio);
// const yStep = Math.floor(1 / yRatio);
// const midPixel = (xStep * yStep) / 2;
// let R = 0;
// let G = 0;
// let B = 0;
// let A = 0;
// let pixelNumber = 1;

// const pixelBuffer = [];

// for (let resultY = 0; resultY++ < desiredHeight; ) {
//   for (let resultX = 0; resultX++ < desiredWidth; ) {
//     const sourceStartIndex =
//       (resultX * xStep + resultY * yStep * sourceData.width) * 4;

//     for (let sourceY = 0; sourceY++ < yStep; pixelNumber++) {
//       for (let sourceX = 0; sourceX++ < xStep; pixelNumber++) {
//         if (pixelNumber === midPixel) {
//           const i =
//             sourceStartIndex + (sourceX + sourceY * sourceData.width) * 4;
//           const { data } = sourceData;
//           R = data[i];
//           G = data[i + 1];
//           B = data[i + 2];
//           A = data[i + 3];

//           pixelBuffer.push(R, G, B, A);
//         }
//       }
//     }

//     pixelNumber = 1;
//   }
// }

// const resultData = new ImageData(desiredWidth, desiredHeight);
// resultData.data.set(pixelBuffer);

// return resultData;
