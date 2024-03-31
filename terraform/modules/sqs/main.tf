resource "aws_sqs_queue" "product_created_queue" {
  name                      = var.product_created_queue
  delay_seconds             = 0
  message_retention_seconds = 604800
  receive_wait_time_seconds = 0
}
