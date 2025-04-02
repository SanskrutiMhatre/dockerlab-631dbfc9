
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dockerimage');
    formData.append('cloud_name', 'dqf2mvisg');

    const response = await fetch('https://api.cloudinary.com/v1_1/dqf2mvisg/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};
