import axios from 'axios';

const DownloadAndSendImage = async (url: string) => {
    try {
        const imageBlob = await downloadImage(url);
        if (imageBlob) {
            const result = await sendImageToBackend(imageBlob);
            console.log('Image uploaded successfully', result);
        }
    } catch (error) {
        console.error('Error in downloadAndSendImage:', error);
    }
};

const downloadImage = async (url: string): Promise<Blob | null> => {
    try {
        const response = await axios.get(url, {
            responseType: 'blob',
        });

        if (response.status !== 200) {
            throw new Error(`Failed to download image. Status: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error downloading image:', error);
        return null;
    }
};

const sendImageToBackend = async (imageBlob: Blob) => {
    try {
        const formData = new FormData();
        formData.append('image', imageBlob, 'image.jpg'); // Assuming the file name is 'image.jpg'

        // Send image data to backend
        const response = await axios.post('/api/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Handle response from backend if needed
    } catch (error) {
        console.error('Error sending image to backend:', error);
    }
};


export default DownloadAndSendImage;
