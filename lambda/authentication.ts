import createResponse from './utils/createResponse';
import AWS = require('aws-sdk');
import { IUser } from '../utils/types';
import { decodePassword, generateToken, hashPassword } from './utils/passwordUtils';
import { v4 as uuid } from 'uuid';
const TABLE_NAME = process.env.TABLE_NAME || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const dynamo = new AWS.DynamoDB.DocumentClient();

const getUser = async (email: string) => {
  const user = await dynamo.get({
      TableName: TABLE_NAME,
      Key: { email }
  }).promise();
  return user.Item;
};

const createUser = async (data: Omit<IUser, 'id'>) => {
  const hashedPassword = await hashPassword(data.password);
  const user = {
    ...data,
    id: uuid(),
    password: hashedPassword,
    isAdmin: data.isAdmin || false,
  };
  await dynamo
    .put({
      TableName: TABLE_NAME,
      Item: {
        ...user,
      },
    })
    .promise();
  return user;
};

exports.handler = async (event: AWSLambda.APIGatewayEvent) => {
  const { httpMethod, path, body } = event;
  if (httpMethod === 'OPTIONS') {
    createResponse('ok');
  }
  if (!body) {
    return createResponse('Missing body', 500);
  }
  const parsedBody: IUser = JSON.parse(body);
  if (httpMethod === 'POST' && path.includes('signin')) {
    const user = await getUser(parsedBody.email);
    if (!user) {
        return createResponse('User does not exist', 404);
    }
    const doesPasswordMatch = await decodePassword(user.password, parsedBody.password);
    if (!doesPasswordMatch) {
        return createResponse('Passwords do not match', 400);
    };
    const token = generateToken(user.email, JWT_SECRET);
    return createResponse(token, 200);
  }
  if (httpMethod === 'POST' && path.includes('register')) {
    const user = await getUser(parsedBody.email);
    if (user) {
      return createResponse('This user already exists', 400);
    }
    const newUser = await createUser(parsedBody);
    return createResponse(JSON.stringify(newUser), 201);
  }
  return createResponse(
    `This endpoint doesn't accept this ${httpMethod} requests`,
    500
  );
};
