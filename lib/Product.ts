import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as s3 from '@aws-cdk/aws-s3';

export class Product extends cdk.Construct {
  public readonly handler: lambda.Function;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    const productImageBucket = new s3.Bucket(this, 'productBucket', {
        publicReadAccess: true,
    });

    this.handler = new lambda.Function(this, 'Product', {
      code: lambda.Code.fromAsset('lambda'),
      handler: 'product.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {
        TABLE_NAME: productsTable.tableName,
        BUCKET_NAME: productImageBucket.bucketName
      }
    });

    productsTable.grantReadWriteData(this.handler);
    productImageBucket.grantPut(this.handler);
    productImageBucket.grantWrite(this.handler);
  }
}
