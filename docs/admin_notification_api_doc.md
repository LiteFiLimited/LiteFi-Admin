# Admin Notifications API Documentation

## Overview
This document outlines the API endpoints for managing admin notifications in the LiteFi platform.

## Base URL
`/admin/notifications`

## Authentication
All endpoints require JWT authentication with admin privileges (ADMIN or SUPER_ADMIN role).

## Endpoints

### Create Admin Notification
- **Method**: POST
- **Endpoint**: `/`
- **Description**: Create a new notification for the current admin
- **Authentication**: Required (Admin)
- **Request Body**:
  ```json
  {
    "title": "string",
    "message": "string",
    "read": false
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "message": "string",
    "read": false,
    "adminId": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

### Get All Admin Notifications
- **Method**: GET
- **Endpoint**: `/`
- **Description**: Retrieve all notifications for the current admin
- **Authentication**: Required (Admin)
- **Response**:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "read": false,
      "adminId": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```

### Get Unread Notifications Count
- **Method**: GET
- **Endpoint**: `/unread-count`
- **Description**: Get the count of unread notifications for the current admin
- **Authentication**: Required (Admin)
- **Response**:
  ```json
  {
    "count": 0
  }
  ```

### Mark All Notifications as Read
- **Method**: PATCH
- **Endpoint**: `/mark-all-read`
- **Description**: Mark all notifications as read for the current admin
- **Authentication**: Required (Admin)
- **Response**:
  ```json
  {
    "count": 0
  }
  ```

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "ForbiddenException"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
``` 