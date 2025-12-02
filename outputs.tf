output "s3_dev_files_bucket_arn" {
  value = data.aws_s3_bucket.dev_files.arn
}

output "eventbridge_bus_arn" {
  value = data.aws_cloudwatch_event_bus.dev.arn
}

output "lambda_exec_role_arn" {
  value = data.aws_iam_role.lambda_exec.arn
}

output "lambda_extra_policy_arn" {
  value = data.aws_iam_policy.lambda_extra.arn
}

output "lambda_function_arn" {
  value = data.aws_lambda_function.hello.arn
}

output "http_api_id" {
  value = data.aws_apigatewayv2_api.dev_http.id
}

output "http_api_endpoint" {
  value = data.aws_apigatewayv2_api.dev_http.api_endpoint
}

# Secrets
output "mongo_secret_arn" {
  value = data.aws_secretsmanager_secret.mongo_uri.arn
}

# Cognito
output "cognito_user_pool_id" {
  value = data.aws_cognito_user_pool.dev.user_pool_id
}

output "cognito_app_client_id" {
  value = data.aws_cognito_user_pool_client.dev_client.client_id
}
