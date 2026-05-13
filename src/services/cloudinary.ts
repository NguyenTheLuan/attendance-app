import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "~/services/firebase";

const storage = getStorage(app);

/**
 * Compress an image file before uploading to reduce storage usage.
 * Resizes to max 800px on the longest edge and reduces JPEG quality to 70%.
 */
function compressImage(
  file: File,
  maxDimension = 800,
  quality = 0.7
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Nén ảnh thất bại"));
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không thể đọc ảnh"));
    };

    img.src = url;
  });
}

export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const fileName = `${Date.now()}_${file.name.replace(/\.[^.]+$/, ".jpg")}`;
  const storageRef = ref(storage, `attendance_images/${fileName}`);

  const snapshot = await uploadBytesResumable(storageRef, compressed);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
