import AWS = require('aws-sdk');
import { IOrder } from '../utils/types';
import { v4 as uuid } from 'uuid';
import createResponse from './utils/createResponse';
import axios from 'axios';

const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';

const getAllOrders = async () => {
  const scanResult = await dynamo
    .scan({
      TableName: TABLE_NAME,
    })
    .promise();
  return scanResult.Items;
};

const getSingleOrder = async (orderId: string) => {
  const order = await dynamo
    .get({
      TableName: TABLE_NAME,
      Key: { id: orderId },
    })
    .promise();
  return order.Item;
};

const createOrder = async (order: Omit<IOrder, 'id'>) => {
  const { product } = order;
  product.forEach(async p => {
    await axios.put(`https://23ii7hvre8.execute-api.eu-west-2.amazonaws.com/prod/${p.id}`, p.qty);
  });
  const newOrder = await dynamo
    .put({
      TableName: TABLE_NAME,
      Item: {
        id: uuid(),
        ...order,
      },
    })
    .promise();
  return newOrder;
};

exports.handler = async function (event: AWSLambda.APIGatewayEvent) {
  const { body, path, pathParameters, httpMethod } = event;
  if (path.includes('/order')) {
    if (httpMethod === 'GET') {
      const orders = await getAllOrders();
      return orders
        ? createResponse(orders, 200)
        : createResponse('No orders found', 404);
    }
    if (httpMethod === 'GET' && pathParameters?.order_id) {
      const singleOrder = await getSingleOrder(pathParameters.order_id);
      return singleOrder
        ? createResponse(singleOrder)
        : createResponse(
            `No order found with ID ${pathParameters.order_id}`,
            404
          );
    }
    if (httpMethod === 'POST') {
      if (!body) {
        return createResponse('Missing order body', 400);
      }
      const parsedBody = JSON.parse(body);
      const newOrder = await createOrder(parsedBody);
      return newOrder
        ? createResponse('Order created successful')
        : createResponse('There was an error processing the order', 500);
    }
    return createResponse('This works');
  }
  return createResponse('No function found for this route', 500);
};
