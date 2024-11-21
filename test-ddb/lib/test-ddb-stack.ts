import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

export class TestDdbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const roles = ['test-ddb-role-1', 'test-ddb-role-2', 'test-ddb-role-3'];

    roles.forEach(roleName => {
      new iam.Role(this, roleName, {
        roleName: roleName,
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        inlinePolicies: {
          DynamoDBAccess: new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                actions: [
                  'dynamodb:*'
                ],
                effect: iam.Effect.ALLOW,
                resources: [
                  "arn:aws:dynamodb:ap-southeast-2:123456789012:table/ddb-table-test",
                  "arn:aws:dynamodb:ap-southeast-2:123456789012:table/ddb-table-test/index/*",
                ]
              })
            ]
          })
        }
      });
    });

    const table = new dynamodb.TableV2(this, 'Table', {
      tableName: 'ddb-table-test',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      resourcePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: [
              'dynamodb:GetShardIterator',
              'dynamodb:Scan',
              'dynamodb:Query',
              'dynamodb:DescribeStream',
              'dynamodb:GetRecords',
              'dynamodb:ListStreams',
            ],
            effect: iam.Effect.ALLOW,
            principals: [
              new iam.ArnPrincipal('arn:aws:iam::123456789012:role/test-ddb-role-1'),
              new iam.ArnPrincipal('arn:aws:iam::123456789012:role/test-ddb-role-2'),
              new iam.ArnPrincipal('arn:aws:iam::123456789012:role/test-ddb-role-3')
            ],
            resources: [
              "arn:aws:dynamodb:ap-southeast-2:123456789012:table/ddb-table-test/index/*",
              "arn:aws:dynamodb:ap-southeast-2:123456789012:table/ddb-table-test/stream/*"
            ],
          }),
          new iam.PolicyStatement({
            actions: [
              "dynamodb:BatchGetItem",
              "dynamodb:BatchWriteItem",
              "dynamodb:ConditionCheckItem",
              "dynamodb:PutItem",
              "dynamodb:DescribeTable",
              "dynamodb:DeleteItem",
              "dynamodb:GetItem",
              "dynamodb:Scan",
              "dynamodb:Query",
              "dynamodb:UpdateItem"
            ],
            effect: iam.Effect.ALLOW,
            principals: [
              new iam.ArnPrincipal('arn:aws:iam::123456789012:role/test-ddb-role-1'),
              new iam.ArnPrincipal('arn:aws:iam::123456789012:role/test-ddb-role-2'),
              new iam.ArnPrincipal('arn:aws:iam::123456789012:role/test-ddb-role-3')
            ],
            resources: [
              "arn:aws:dynamodb:ap-southeast-2:123456789012:table/ddb-table-test"
            ],
          })
        ]
      })
    });
  }
}
