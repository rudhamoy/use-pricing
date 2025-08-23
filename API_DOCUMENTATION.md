# Public API Documentation

Welcome to the API documentation for our pricing and packaging service. This document will guide you through the process of integrating our service into your application.

## Authentication

All requests to the public API must be authenticated using an API key. You can find the API key for your application in the dashboard.

The API key must be included in the `x-api-key` header of every request.

## Endpoints

### 1. Get Plans

This endpoint allows you to fetch all of the pricing plans for your application.

*   **URL:** `/api/public/plans/{appId}`
*   **Method:** `GET`
*   **Headers:**
    *   `x-api-key`: Your application's API key.
*   **Success Response:**
    *   **Code:** 200
    *   **Content:**
        ```json
        {
          "success": true,
          "data": [
            {
              "id": "plan_id",
              "name": "Basic Plan",
              "description": "The basic plan.",
              "baseFee": 10,
              "billingCycle": "monthly",
              "features": [
                {
                  "feature": {
                    "name": "Image Generation"
                  },
                  "config": {
                    "limit": 10
                  }
                }
              ]
            }
          ]
        }
        ```

### 2. Check Feature Access

This endpoint allows you to check if a user has access to a specific feature.

*   **URL:** `/api/public/features/check`
*   **Method:** `POST`
*   **Headers:**
    *   `x-api-key`: Your application's API key.
*   **Body:**
    ```json
    {
      "userId": "user_12345",
      "featureName": "Image Generation"
    }
    ```
*   **Success Response:**
    *   **Code:** 200
    *   **Content:**
        ```json
        {
          "success": true,
          "data": {
            "hasAccess": true
          }
        }
        ```

### 3. Record Usage

This endpoint allows you to record the usage of a feature.

*   **URL:** `/api/public/usage/record`
*   **Method:** `POST`
*   **Headers:**
    *   `x-api-key`: Your application's API key.
*   **Body:**
    ```json
    {
      "userId": "user_12345",
      "unitType": "image_generation",
      "amount": 1
    }
    ```
*   **Success Response:**
    *   **Code:** 200
    *   **Content:**
        ```json
        {
          "success": true,
          "data": {
            "id": "usage_record_id",
            "userId": "user_12345",
            "unitType": "image_generation",
            "amount": 1,
            "recordedAt": "2025-08-23T20:51:49.864Z"
          }
        }