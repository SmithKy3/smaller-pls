export async function downSample(
  img: HTMLImageElement,
  desiredWidth: number,
  desiredHeight: number
): Promise<ImageData> {
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx!.drawImage(img, 0, 0);
  const sourceData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

  const xRatio = desiredWidth / img.width;
  const yRatio = desiredHeight / img.height;
  const xStep = Math.floor(1 / xRatio);
  const yStep = Math.floor(1 / yRatio);
  const stepArea = xStep * yStep;

  const pixelBuffer = [];

  for (let resultY = 0; resultY++ < desiredHeight; ) {
    for (let resultX = 0; resultX++ < desiredWidth; ) {
      const sourceStartIndex =
        (resultX * xStep + resultY * yStep * img.width) * 4;

      let R = 0;
      let G = 0;
      let B = 0;
      let A = 0;

      for (let sourceY = 0; sourceY++ < yStep; ) {
        for (let sourceX = 0; sourceX++ < xStep; ) {
          const i = sourceStartIndex + (sourceX + sourceY * img.width) * 4;
          const { data } = sourceData;
          R += data[i];
          G += data[i + 1];
          B += data[i + 2];
          A += data[i + 3];
        }
      }

      R /= stepArea;
      G /= stepArea;
      B /= stepArea;
      A /= stepArea;

      pixelBuffer.push(R, G, B, A);
    }
  }

  const resultData = new ImageData(desiredWidth, desiredHeight);
  resultData.data.set(pixelBuffer);

  return resultData;
}
