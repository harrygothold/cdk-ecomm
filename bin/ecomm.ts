#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { EcommStack } from '../lib/ecomm-stack';

const app = new cdk.App();
new EcommStack(app, 'EcommStack');
