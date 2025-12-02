###################################
# EXISTING AWS RESOURCES (STABLE)
###################################

# S3 bucket
data "aws_s3_bucket" "dev_files" {
  bucket = "zyndrx-dev-files"
}

# EventBridge bus
data "aws_cloudwatch_event_bus" "dev" {
  name = "zyndrx-events-dev"
}

# Lambda execution role
data "aws_iam_role" "lambda_exec" {
  name = "zyndrx-dev-lambda-exec-role"
}

# Extra Lambda policy
data "aws_iam_policy" "lambda_extra" {
  name = "zyndrx-dev-lambda-extra"
}

# Lambda function
data "aws_lambda_function" "hello" {
  function_name = "zyndrx-dev-hello"
}

###################################
# API GATEWAY HTTP API (stable lookup)
###################################

data "aws_apigatewayv2_api" "dev_http" {
  api_id = var.http_api_id
}


###################################
# CloudWatch log group
###################################

data "aws_cloudwatch_log_group" "lambda_dev" {
  name = "/aws/lambda/zyndrx-dev-hello"
}

###################################
# Secrets Manager
###################################

data "aws_secretsmanager_secret" "mongo_uri" {
  name = "/zyndrx/dev/mongo_uri"
}

###################################
# Cognito (fixed arguments)
###################################

data "aws_cognito_user_pool" "dev" {
  user_pool_id = "us-east-1_aIEeocSTC"
}

data "aws_cognito_user_pool_client" "dev_client" {
  user_pool_id = data.aws_cognito_user_pool.dev.user_pool_id
  client_id    = "4uv9ou4e03dcvt20fldpc350fv"
}
