#!/bin/bash

# Test webhook script for Dodo Payments
# This script helps test the webhook endpoint locally

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing Dodo Payments Webhook${NC}"
echo ""

# Set webhook URL
WEBHOOK_URL="${1:-http://localhost:3000/api/webhooks/dodo}"

echo "Webhook URL: $WEBHOOK_URL"
echo ""

# Test payload
PAYLOAD='{
  "type": "payment.succeeded",
  "data": {
    "payment": {
      "id": "pay_test123",
      "sessionId": "sess_test123",
      "amount": "9.99",
      "currency": "USD",
      "status": "succeeded"
    },
    "customer": {
      "id": "cus_test123",
      "email": "test@example.com"
    },
    "metadata": {
      "userId": "test-user-id",
      "productId": "pdt_QI7mLpKaeGrFNijDk2Jvw"
    }
  }
}'

# Get timestamp
TIMESTAMP=$(date +%s)000

# Calculate signature (Dodo Payments style)
WEBHOOK_SECRET="${DODO_WEBHOOK_SECRET:-whsec_gu64GlGK16hlw6TlB3Y83fQE1263ZYSX}"
SIGNED_PAYLOAD="${TIMESTAMP}.${PAYLOAD}"
SIGNATURE=$(echo -n "${SIGNED_PAYLOAD}" | openssl dgst -sha256 -hmac "${WEBHOOK_SECRET}" | sed 's/^.* //')

echo "Testing WITH signature..."
echo ""

# Send webhook request with signature
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "webhook-signature: v1=${SIGNATURE}" \
  -H "webhook-timestamp: ${TIMESTAMP}" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Webhook test PASSED${NC}"
else
  echo -e "${RED}❌ Webhook test FAILED${NC}"
  echo ""
  echo "Troubleshooting:"
  echo "1. Make sure your dev server is running (npm run dev)"
  echo "2. Check the server logs for detailed error messages"
  echo "3. Verify DODO_WEBHOOK_SECRET in .env file"
  echo ""
  echo "To skip verification in development, add to .env:"
  echo "SKIP_WEBHOOK_VERIFICATION=true"
fi

echo ""
echo "Testing WITHOUT signature (should fail in production)..."
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
echo ""
