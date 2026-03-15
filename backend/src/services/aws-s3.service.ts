import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
  region: String(process.env.AWS_REGION),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
const bucketName = process.env.BUCKET_NAME;

export const getSignedS3Url = async (fileName, fileType, expireTime = 900) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: expireTime,
    });
    return signedUrl;
  } catch (err) {
    console.error('Error generating presigned URL', err);
    throw err;
  }
};
