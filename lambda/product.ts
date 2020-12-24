import AWS = require('aws-sdk');
import { IProduct } from '../utils/types';
import { v4 as uuid } from 'uuid';
import createResponse from './utils/createResponse';
import { uploadImageToS3 } from './utils/uploadImageToS3';

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const BUCKET_NAME = process.env.BUCKET_NAME || '';

const addProduct = async (data: Omit<IProduct, 'id'>) => {
  const id = uuid();
  const { image } = data;
  const base64 = image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  const imageUrl = await uploadImageToS3(id + '.jpg', buffer, BUCKET_NAME);
  if (imageUrl) {
    const newData = { ...data, image: imageUrl };
    await dynamo
      .put({
        TableName: TABLE_NAME,
        Item: {
          id,
          ...newData,
        },
      })
      .promise();
  }
  return data;
};

const getAllProducts = async () => {
  const scanResult = await dynamo
    .scan({
      TableName: TABLE_NAME,
    })
    .promise();
  return scanResult.Items;
};

const getProductById = async (id: string) => {
  const product = await dynamo.get({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();
  return product.Item;
}

const deleteProduct = async (id: string) => {
  await dynamo
    .delete({
      TableName: TABLE_NAME,
      Key: { id },
    })
    .promise();
  return id;
};

exports.handler = async (event: AWSLambda.APIGatewayEvent) => {
  const { httpMethod, body: requestBody, pathParameters } = event;
  try {
    if (httpMethod === 'OPTIONS') {
      return createResponse('Ok');
    }
    if (httpMethod === 'POST') {
      if (!requestBody) {
        return createResponse('Missing request body', 500);
      }
      const newProduct = JSON.parse(requestBody);
      const product = await addProduct(newProduct);
      return product
        ? createResponse(`${product.name} has been added`, 201)
        : createResponse('Product not created', 500);
    }
    if (httpMethod === 'GET') {
      const allProducts = await getAllProducts();
      return createResponse(allProducts || []);
    }

    if (httpMethod === 'GET' && pathParameters?.product_id) {
      const product = await getProductById(pathParameters.product_id);
      if (product) {
        return createResponse(product, 200);
      }
    }

    if (httpMethod === 'DELETE') {
      if (!pathParameters?.product_id) {
        return createResponse('Product ID is missing', 500);
      }
      const id = await deleteProduct(pathParameters.product_id);
      return id
        ? createResponse(`Product with ID: ${id} has been deleted`)
        : createResponse('Something went wrong', 500);
    }
    return createResponse('Method not found', 500);
  } catch (error) {
    console.log(error);
    return createResponse(error, 500);
  }
};
