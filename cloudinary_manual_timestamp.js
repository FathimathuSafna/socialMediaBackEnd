import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'qubxw9f3',
  api_key: '641171666156894',
  api_secret: 'jjzD0F2IZuYITfvhsESy1vUz4I0'
});

async function run() {
  try {
    const timeResponse = await fetch('https://www.google.com');
    const serverDate = new Date(timeResponse.headers.get('date'));
    const correctTimestamp = Math.floor(serverDate.getTime() / 1000);

    console.log('Using corrected timestamp:', correctTimestamp);

    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/dog.jpg';
    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
      folder: 'test_folder',
      timestamp: correctTimestamp
    });

    console.log('Upload Success!');
    console.log('Secure URL:', uploadResult.secure_url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

run();
