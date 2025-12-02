terraform {
  backend "s3" {
    bucket         = "zyndrx-tf-state"
    key            = "dev/zyndrx.tfstate"
    region         = "us-east-1"
    dynamodb_table = "zyndrx-tf-locks"
    encrypt        = true
  }
}
