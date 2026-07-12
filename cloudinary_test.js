import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'qubxw9f3',
  api_key: '641171666156894',
  api_secret: 'jjzD0F2IZuYITfvhsESy1vUz4I0'
});

async function run() {
  const originalDate = Date;
  try {
    // Correct the clock drift by fetching public server time
    console.log('Synchronizing clock with server to prevent drift errors...');
    const timeResponse = await fetch('https://www.google.com');
    const serverDate = new Date(timeResponse.headers.get('date'));
    const offsetMs = serverDate.getTime() - Date.now();
    console.log(`Clock drift offset: ${offsetMs} ms`);

    // Override global Date
    class MockedDate extends originalDate {
      constructor(...args) {
        if (args.length === 0) {
          super(originalDate.now() + offsetMs);
        } else {
          super(...args);
        }
      }
    }
    MockedDate.now = () => originalDate.now() + offsetMs;
    globalThis.Date = MockedDate;

    // Upload a sample image
    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/dog.jpg';
    console.log('Uploading sample image...');
    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
      folder: 'test_folder'
    });

    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // Get image details by fetching metadata from Cloudinary api
    console.log('Fetching image details...');
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log('Width:', details.width);
    console.log('Height:', details.height);
    console.log('Format:', details.format);
    console.log('File size (bytes):', details.bytes);

    // Transform the image
    // fetch_format: 'auto' (f_auto) - Automatically selects the best image format depending on browser capabilities
    // quality: 'auto' (q_auto) - Automatically optimizes the quality and compression of the image
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true
    });

    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(transformedUrl);

    // Restore original Date
    globalThis.Date = originalDate;
  } catch (error) {
    globalThis.Date = originalDate;
    console.error('Error:', error);
  }
}

run();
