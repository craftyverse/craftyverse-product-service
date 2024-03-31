# ======================================================================
# Topic variables
#=======================================================================

variable "product_created_topic" {
  type        = string
  description = "The name of the SNS topic to create for product created events"
}

# ======================================================================
# Queue variables
#=======================================================================
variable "product_created_queue" {
  type        = string
  description = "The name of the SQS queue to create for product created events"
}
