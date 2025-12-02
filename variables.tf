variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "zyndrx"
}

variable "env" {
  description = "Environment name"
  type        = string
  default     = "dev"
}
variable "http_api_id" {
  description = "Existing API Gateway HTTP API ID"
  type        = string
}
