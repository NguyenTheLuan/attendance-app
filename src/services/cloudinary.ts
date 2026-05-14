/**
 * Upload ảnh lên Cloudinary (không cần Firebase Storage, không cần thẻ tín dụng)
 * Cloud Name: dimkxloaf
 * Upload Preset: attendance_preset (Unsigned)
 */

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "attendance_preset");
  formData.append("folder", "attendance_images");

  console.log("Uploading to Cloudinary...", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dimkxloaf/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudinary upload failed:", response.status, errorText);
    throw new Error(`Upload thất bại: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("Cloudinary upload success:", data.secure_url);
  return data.secure_url;
}
