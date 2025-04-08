export const uploadToCloudinary = async (file, preset) => {
  if (!file) {
    console.error("No file provided for upload.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset); // Pass preset dynamically

  const CLOUDINARY_CLOUD_NAME = "de3did404"; // Ideally, store in .env or config
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Cloudinary upload failed: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.secure_url; // Return uploaded file URL
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
