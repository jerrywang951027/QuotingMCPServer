#!/bin/bash
# MCP Server Inspector Script
# Set your Salesforce credentials as environment variables before running this script
# Example:
# export SALESFORCE_CONNECTION_TYPE="OAuth_2.0_Client_Credentials"
# export SALESFORCE_CLIENT_ID="your_client_id"
# export SALESFORCE_CLIENT_SECRET="your_client_secret"
# export SALESFORCE_INSTANCE_URL="https://your-domain.my.salesforce.com"

npx @modelcontextprotocol/inspector \
  -e SALESFORCE_CONNECTION_TYPE="$SALESFORCE_CONNECTION_TYPE" \
  -e SALESFORCE_CLIENT_ID="$SALESFORCE_CLIENT_ID" \
  -e SALESFORCE_CLIENT_SECRET="$SALESFORCE_CLIENT_SECRET" \
  -e SALESFORCE_INSTANCE_URL="$SALESFORCE_INSTANCE_URL" \
  node dist/index.js