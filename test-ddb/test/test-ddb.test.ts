import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TestDdbStack } from '../lib/test-ddb-stack';

test('DynamoDB Stack Snapshot', () => {
  const app = new cdk.App();
  const stack = new TestDdbStack(app, 'TestDdbStack');

  const template = Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});