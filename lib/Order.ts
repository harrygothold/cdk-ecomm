import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class Order extends cdk.Construct {
  public readonly handler: lambda.Function;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.handler = new lambda.Function(this, 'Order', {
      code: lambda.Code.fromAsset('lambda'),
      handler: 'order.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {
        TABLE_NAME: ordersTable.tableName
      }
    });

    ordersTable.grantReadWriteData(this.handler);
  }
}
