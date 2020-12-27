import * as cdk from '@aws-cdk/core';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import { Product } from './Product';
import { Authentication } from './Authentication';
import { Order } from './Order';

export class EcommStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const product = new Product(this, 'ProductBackend');
    const authentication = new Authentication(this, 'AuthenticationBackend');
    const order = new Order(this, 'OrderBackend');

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

    const singleUserRoute = authApi.root.addResource('{token}')
    singleUserRoute.addMethod('GET');

    const registerRoute = authApi.root.addResource('register');
    registerRoute.addMethod('POST');

    const signInRoute = authApi.root.addResource('signin');
    signInRoute.addMethod('POST');

    const authRoots: apiGateway.Resource[] = [singleUserRoute, registerRoute, signInRoute];
    authRoots.forEach(route => route.addMethod('OPTIONS'));

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
    const singleProduct = products.addResource('{product_id}');
    singleProduct.addMethod('DELETE');
    singleProduct.addMethod('PUT');
    singleProduct.addMethod('GET');

    const productRoutes: apiGateway.Resource[] = [products, singleProduct];
    productRoutes.forEach(route => route.addMethod('OPTIONS'));

    /*
     *
     * Order routes
     *
     * */

     const orderApi: apiGateway.LambdaRestApi = new apiGateway.LambdaRestApi(this, 'orderEndpoint', {
        handler: order.handler,
        proxy: false,
     });
     const orderRoute = orderApi.root.addResource('order');
     orderRoute.addMethod('GET')
     orderRoute.addMethod('POST')
     const singleOrder = orderRoute.addResource('{order_id}');
     singleOrder.addMethod('GET');

     const orderRoutes: apiGateway.Resource[] = [orderRoute, singleOrder];
     orderRoutes.forEach(route => route.addMethod('OPTIONS'));

  }
}
