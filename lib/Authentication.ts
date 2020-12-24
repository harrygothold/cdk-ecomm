import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamo from '@aws-cdk/aws-dynamodb';

export class Authentication extends cdk.Construct {
    public readonly handler: lambda.Function;
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id);

        const usersTable = new dynamo.Table(this, 'UsersTable', {
            partitionKey: {
                name: 'email',
                type: dynamo.AttributeType.STRING
            }
        });

        this.handler = new lambda.Function(this, 'Authentication', {
            code: lambda.Code.fromAsset('lambda'),
            handler: 'authentication.handler',
            runtime: lambda.Runtime.NODEJS_12_X,
            environment: {
                TABLE_NAME: usersTable.tableName,
                JWT_SECRET: 'sfgsdfgsfgsdrtwertwertsfgsdf'
            }
        });

        usersTable.grantReadWriteData(this.handler);
    }
}