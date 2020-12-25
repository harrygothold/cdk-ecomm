import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Ecomm from '../lib/ecomm-stack';

// test('SQS Queue Created', () => {
//     const app = new cdk.App();
//     // WHEN
//     const stack = new Ecomm.EcommStack(app, 'MyTestStack');
//     // THEN
//     expectCDK(stack).to(haveResource("AWS::SQS::Queue",{
//       VisibilityTimeout: 300
//     }));
// });

// test('SNS Topic Created', () => {
//   const app = new cdk.App();
//   // WHEN
//   const stack = new Ecomm.EcommStack(app, 'MyTestStack');
//   // THEN
//   expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
// });

// test('Authentication APIGW created', () => {
//   const app = new cdk.App();
//   const stack = new Ecomm.EcommStack(app, 'TestStack');
//   expectCDK(stack).to(haveResource("AWS::API::Gateway"));
// })

test('it works', () => {
  const app = new cdk.App();
  const stack = new Ecomm.EcommStack(app, 'TestStack');
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
})