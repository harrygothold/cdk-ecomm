type Response = string | AWS.DynamoDB.DocumentClient.ItemList | AWS.DynamoDB.DocumentClient.AttributeMap;

const createResponse = (body: Response, statusCode: number = 200) => ({
    statusCode,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
        "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify(body, null, 2),
});

export default createResponse;