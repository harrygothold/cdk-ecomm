import { S3 } from 'aws-sdk';
import createResponse from './createResponse';

const s3 = new S3();

export const uploadImageToS3 = async (
  key: string,
  body: Buffer,
  bucket: string
) => {
  let result;
  try {
    result = await s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      })
      .promise();
    return result.Location;
  } catch (error) {
    createResponse(error, 500);
  }
  return result?.Location;
};
