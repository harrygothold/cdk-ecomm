import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import { Product } from './Product';
import { Authentication } from './Authentication';

export class EcommStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const product = new Product(this, 'ProductBackend');
    const authentication = new Authentication(this, 'AuthenticationBackend');

    /*
     *
     * Authentication routes
     *
     * */
    const authApi: apiGateway.LambdaRestApi = new apiGateway.LambdaRestApi(
      this,
      'authenticationEndpoint',
      {
        handler: authentication.handler,
        proxy: false,
      }
    );

    const singleUser = authApi.root.addResource('{token}')
    singleUser.addMethod('GET');

    const registerRouter = authApi.root.addResource('register');
    registerRouter.addMethod('POST');
    registerRouter.addMethod('OPTIONS');

    const signInRoot = authApi.root.addResource('signin');
    signInRoot.addMethod('POST');
    signInRoot.addMethod('OPTIONS');

    /*
     *
     * Product routes
     *
     * */

    const productApi: apiGateway.LambdaRestApi = new apiGateway.LambdaRestApi(
      this,
      'productEndpoint',
      {
        handler: product.handler,
        proxy: false,
      }
    );
    const products = productApi.root.addResource('product');
    products.addMethod('GET');
    products.addMethod('POST');
    products.addMethod('OPTIONS');
    const singleProduct = products.addResource('{product_id}');
    singleProduct.addMethod('DELETE');
    singleProduct.addMethod('GET');
  }
}
