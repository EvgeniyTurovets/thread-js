export const getCroppedImg = (image, cropData) => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = cropData.width;
  canvas.height = cropData.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    cropData.x * scaleX,
    cropData.y * scaleY,
    cropData.width * scaleX,
    cropData.height * scaleY,
    0,
    0,
    cropData.width,
    cropData.height
  );

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, 'image/png', 1);
  });
};
