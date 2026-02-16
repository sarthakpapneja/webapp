#!/bin/bash

# Base URL
API_URL="http://localhost:5001/api"

echo "Verifying API endpoints..."

# Register User
echo "1. Registering User..."
REGISTER_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","password":"password123"}' $API_URL/auth/register)
echo $REGISTER_RESPONSE

# Extract Token
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Login to get token (if user already exists)"
    LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}' $API_URL/auth/login)
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
    echo "Failed to get token. Exiting."
    exit 1
fi

# Get User Profile
echo "2. Getting User Profile..."
curl -s -X GET -H "Authorization: Bearer $TOKEN" $API_URL/auth/me
echo ""

# Create Task
echo "3. Creating Task..."
TASK_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"title":"Test Task","description":"This is a test task"}' $API_URL/tasks)
echo $TASK_RESPONSE
TASK_ID=$(echo $TASK_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Task ID: $TASK_ID"

# Get Tasks
echo "4. Getting Tasks..."
curl -s -X GET -H "Authorization: Bearer $TOKEN" $API_URL/tasks
echo ""

# Update Task
if [ ! -z "$TASK_ID" ]; then
    echo "5. Updating Task..."
    curl -s -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"status":"completed"}' $API_URL/tasks/$TASK_ID
    echo ""
    
    # Delete Task
    echo "6. Deleting Task..."
    curl -s -X DELETE -H "Authorization: Bearer $TOKEN" $API_URL/tasks/$TASK_ID
    echo ""
fi

echo "Verification Complete."
