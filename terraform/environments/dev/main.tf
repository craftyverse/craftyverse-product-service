provider "aws" {
  endpoints {
    sqs = "http://127.0.0.1:4566"
    sns = "http://127.0.0.1:4566"
  }
}

module "sns" {
  source = "../../modules/sns"

  prodcut_created_topic = var.product_created_topic
}

