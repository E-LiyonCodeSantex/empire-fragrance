import cloudinary from "@/config/cloudinary";

export async function uploadToCloudinary(fileBuffer: Buffer, mimetype: string) {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve({ secure_url: result.secure_url });
      }
    );

    stream.end(fileBuffer);
  });
}
