# LiteFi Backend - Admin API Endpoints Documentation

## 📋 Overview

This document provides comprehensive information about all administrative API endpoints available in the LiteFi Backend system. These endpoints are designed for frontend integration to build a complete admin dashboard with full management capabilities.

**Base URL**: `http://localhost:3000`

## 🔐 Authentication & Authorization

### Admin vs User Architecture

LiteFi uses a **two-table authentication system** for enterprise-level security:

- **Admin Table**: Management staff with roles `SUPER_ADMIN`, `ADMIN`, `SALES`, `RISK`, `FINANCE`, `COMPLIANCE`, `COLLECTIONS`, `PORT_MGT`
- **User Table**: Platform customers with role `USER`

**IMPORTANT**: Admins and Users are completely separate entities with different authentication flows.

### Admin Authentication

All admin endpoints require:
- **Bearer Token Authentication**: Include `Authorization: Bearer <jwt_token>` in request headers
- **Admin Role**: User must have a valid admin role (see roles below)
- **Content-Type**: `application/json` for POST/PUT requests

### Admin Login
**Endpoint**: `POST /auth/admin/login`  
**Description**: Authenticates admin users and returns JWT token

**Request Body**:
```json
{
  "email": "joseph.awe@litefi.ng",
  "password": "Qwertyuiop1!"
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "admin_123",
      "firstName": "Joseph",
      "lastName": "Awe",
      "email": "joseph.awe@litefi.ng",
      "role": "SUPER_ADMIN",
      "active": true,
      "createdAt": "2023-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Admin Logout
**Endpoint**: `POST /auth/admin/logout`  
**Description**: Logs out admin user and invalidates token

**Headers Required**:
```bash
Authorization: Bearer <jwt_token>
```

**Response Example**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Get Admin Profile
**Endpoint**: `GET /auth/admin/profile`  
**Description**: Returns current authenticated admin's profile information

**Headers Required**:
```bash
Authorization: Bearer <jwt_token>
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "admin_123",
    "firstName": "Joseph",
    "lastName": "Awe",
    "email": "joseph.awe@litefi.ng",
    "role": "SUPER_ADMIN",
    "active": true,
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

### Token Refresh
**Endpoint**: `POST /auth/admin/refresh`  
**Description**: Refreshes expired JWT token

**Headers Required**:
```bash
Authorization: Bearer <jwt_token>
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

### Current Admin Accounts

| Name | Email | Role | Password | Status |
|------|-------|------|----------|---------|
| Joseph Awe | joseph.awe@litefi.ng | SUPER_ADMIN | Qwertyuiop1! | ✅ Active |
| Kayode Alao | kay@litefi.ng | SUPER_ADMIN | Qwertyuiop1! | ✅ Active |
| Olaitan Awe | awejosepholaitan@gmail.com | ADMIN | Qwertyuiop1! | ✅ Active |

### Admin Roles & Permissions

| Role | Description | Access Level |
|------|-------------|--------------|
| **SUPER_ADMIN** | Full system access | Complete control over all features |
| **ADMIN** | General administrative access | Most features except role management |
| **SALES** | Customer acquisition focus | User management, applications |
| **RISK** | Risk assessment specialist | Loan approvals, risk analysis |
| **FINANCE** | Financial operations | Transaction monitoring, approvals |
| **COMPLIANCE** | Regulatory compliance | Verification, compliance checks |
| **COLLECTIONS** | Debt collection | Loan monitoring, collection activities |
| **PORT_MGT** | Portfolio management | Investment oversight, portfolio analysis |

### Authentication Header Example
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🏠 Dashboard & Overview

### Get Admin Dashboard Summary
**Endpoint**: `GET /admin/dashboard/summary`  
**Description**: Returns comprehensive dashboard statistics and overview

**Response Example**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "activeUsers": 850,
      "totalLoans": 320,
      "activeLoans": 180,
      "totalInvestments": 420,
      "activeInvestments": 280,
      "totalTransactions": 5600,
      "totalRevenue": 15750000
    },
    "recentStats": {
      "newUsersToday": 25,
      "newLoansToday": 8,
      "newInvestmentsToday": 12,
      "transactionsToday": 156
    },
    "monthlyGrowth": {
      "userGrowth": 12.5,
      "loanGrowth": 18.3,
      "investmentGrowth": 22.1,
      "revenueGrowth": 15.8
    }
  },
  "message": "Dashboard summary retrieved successfully"
}
```

### Get Recent Activities
**Endpoint**: `GET /admin/dashboard/recent-activities`  
**Description**: Returns recent platform activities across all modules

**Response Example**:
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "act_123",
        "type": "USER_REGISTRATION",
        "description": "New user registered: John Doe",
        "timestamp": "2023-01-01T10:30:00Z",
        "severity": "INFO"
      },
      {
        "id": "act_124",
        "type": "LOAN_APPLICATION",
        "description": "Loan application submitted: ₦500,000",
        "timestamp": "2023-01-01T10:25:00Z",
        "severity": "INFO"
      }
    ],
    "pagination": {
      "total": 500,
      "page": 1,
      "limit": 20,
      "pages": 25
    }
  }
}
```

### Get Loan Statistics
**Endpoint**: `GET /admin/dashboard/loan-stats`  
**Description**: Returns detailed loan statistics and analytics

**Response Example**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalLoans": 320,
      "activeLoans": 180,
      "completedLoans": 95,
      "defaultedLoans": 12,
      "totalLoanAmount": 125000000,
      "totalRepaid": 89500000
    },
    "byStatus": {
      "PENDING": 45,
      "APPROVED": 25,
      "ACTIVE": 180,
      "COMPLETED": 95,
      "DEFAULTED": 12,
      "REJECTED": 28
    },
    "byType": {
      "SALARY": 180,
      "WORKING_CAPITAL": 85,
      "AUTO": 35,
      "PERSONAL": 20
    },
    "monthlyData": [
      {
        "month": "2023-01",
        "applications": 28,
        "approved": 22,
        "disbursed": 20,
        "amount": 12500000
      }
    ]
  }
}
```

### Get Investment Statistics
**Endpoint**: `GET /admin/dashboard/investment-stats`  
**Description**: Returns detailed investment statistics and analytics

**Response Example**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalInvestments": 420,
      "activeInvestments": 280,
      "maturedInvestments": 115,
      "totalInvestmentAmount": 185000000,
      "totalInterestPaid": 12750000
    },
    "byStatus": {
      "PENDING": 25,
      "ACTIVE": 280,
      "MATURED": 115,
      "WITHDRAWN": 85,
      "CANCELLED": 8
    },
    "byType": {
      "NAIRA": 320,
      "FOREIGN": 85,
      "EQUITY": 15
    },
    "monthlyData": [
      {
        "month": "2023-01",
        "investments": 35,
        "amount": 18500000,
        "interestPaid": 850000
      }
    ]
  }
}
```

### Get System Health
**Endpoint**: `GET /admin/system-health`  
**Description**: Returns system health status and service availability

**Response Example**:
```json
{
  "success": true,
  "data": {
    "database": {
      "status": "CONNECTED",
      "responseTime": "12ms",
      "connections": 15
    },
    "externalServices": {
      "mono": {
        "status": "AVAILABLE",
        "responseTime": "145ms",
        "lastChecked": "2023-01-01T10:30:00Z"
      },
      "dot": {
        "status": "AVAILABLE",
        "responseTime": "89ms",
        "lastChecked": "2023-01-01T10:30:00Z"
      },
      "zeptomail": {
        "status": "AVAILABLE",
        "responseTime": "234ms",
        "lastChecked": "2023-01-01T10:30:00Z"
      },
      "sms": {
        "status": "AVAILABLE",
        "responseTime": "167ms",
        "lastChecked": "2023-01-01T10:30:00Z"
      }
    },
    "serverMetrics": {
      "uptime": "14d 5h 30m",
      "memoryUsage": "68%",
      "cpuUsage": "23%",
      "diskUsage": "45%"
    }
  }
}
```

---

## 👥 User Management

### Get All Users
**Endpoint**: `GET /admin/users`  
**Description**: Returns paginated list of users with search and filters

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or phone
- `role` (optional): Filter by user role (USER, ADMIN, etc.)
- `verified` (optional): Filter by verification status (true/false)
- `isActive` (optional): Filter by active status (true/false)

**Example Request**:
```
GET /admin/users?page=1&limit=20&search=john&verified=true&isActive=true
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+2348123456789",
        "role": "USER",
        "verified": true,
        "emailVerified": true,
        "phoneVerified": true,
        "isActive": true,
        "accountType": "INDIVIDUAL",
        "country": "NG",
        "createdAt": "2023-01-01T00:00:00Z",
        "lastLoginAt": "2023-01-15T08:30:00Z"
      }
    ],
    "pagination": {
      "total": 1250,
      "page": 1,
      "limit": 20,
      "pages": 63
    }
  },
  "message": "Users retrieved successfully"
}
```

### Get User by ID
**Endpoint**: `GET /admin/users/:id`  
**Description**: Returns detailed information about a specific user

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+2348123456789",
    "role": "USER",
    "verified": true,
    "emailVerified": true,
    "phoneVerified": true,
    "isActive": true,
    "accountType": "INDIVIDUAL",
    "country": "NG",
    "createdAt": "2023-01-01T00:00:00Z",
    "profile": {
      "dateOfBirth": "1990-01-01",
      "gender": "MALE",
      "address": "123 Main Street",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "bvn": "12345678901",
      "nin": "98765432101"
    },
    "employment": {
      "status": "EMPLOYED",
      "employer": "Tech Company Ltd",
      "jobTitle": "Software Engineer",
      "monthlySalary": 350000,
      "workEmail": "john@techcompany.com"
    },
    "wallet": {
      "balance": 25000,
      "currency": "NGN"
    },
    "statistics": {
      "totalLoans": 3,
      "activeLoans": 1,
      "totalInvestments": 5,
      "activeInvestments": 3,
      "totalTransactions": 28
    }
  },
  "message": "User retrieved successfully"
}
```

### Update User
**Endpoint**: `PUT /admin/users/:id`  
**Description**: Updates user information

**Request Body Example**:
```json
{
  "email": "newemail@example.com",
  "phone": "+2348123456789",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "verified": true,
  "emailVerified": true,
  "phoneVerified": true,
  "isActive": true
}
```

### Update User Status
**Endpoint**: `PUT /admin/users/:id/status`  
**Description**: Activate or deactivate a user account

**Request Body Example**:
```json
{
  "isActive": false
}
```

### Get User Loans
**Endpoint**: `GET /admin/users/:id/loans`  
**Description**: Returns all loans for a specific user

### Get User Investments
**Endpoint**: `GET /admin/users/:id/investments`  
**Description**: Returns all investments for a specific user

### Get User Transactions
**Endpoint**: `GET /admin/users/:id/transactions`  
**Description**: Returns all transactions for a specific user

---

## 💰 Loan Management

### Get All Loans
**Endpoint**: `GET /admin/loans`  
**Description**: Returns paginated list of loans with search and filters

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by reference, user name, or email
- `status` (optional): Filter by loan status (PENDING, APPROVED, ACTIVE, etc.)
- `type` (optional): Filter by loan type (SALARY, WORKING_CAPITAL, AUTO, PERSONAL)

**Response Example**:
```json
{
  "success": true,
  "data": {
    "loans": [
      {
        "id": "loan_123",
        "reference": "LN-12345678",
        "amount": 500000,
        "approvedAmount": 450000,
        "status": "ACTIVE",
        "type": "SALARY",
        "interestRate": 15,
        "duration": 12,
        "totalPayable": 517500,
        "startDate": "2023-01-01T00:00:00Z",
        "maturityDate": "2024-01-01T00:00:00Z",
        "purpose": "Home renovation",
        "createdAt": "2023-01-01T00:00:00Z",
        "user": {
          "id": "user_123",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com",
          "phone": "+2348123456789"
        },
        "product": {
          "id": "product_123",
          "name": "Premium Salary Advance",
          "type": "SALARY"
        }
      }
    ],
    "pagination": {
      "total": 320,
      "page": 1,
      "limit": 10,
      "pages": 32
    }
  }
}
```

### Get Loan by ID
**Endpoint**: `GET /admin/loans/:id`  
**Description**: Returns detailed information about a specific loan

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "loan_123",
    "reference": "LN-12345678",
    "amount": 500000,
    "approvedAmount": 450000,
    "status": "ACTIVE",
    "type": "SALARY",
    "interestRate": 15,
    "duration": 12,
    "totalPayable": 517500,
    "amountPaid": 172500,
    "balanceRemaining": 345000,
    "startDate": "2023-01-01T00:00:00Z",
    "maturityDate": "2024-01-01T00:00:00Z",
    "purpose": "Home renovation",
    "createdAt": "2023-01-01T00:00:00Z",
    "user": {
      "id": "user_123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+2348123456789"
    },
    "product": {
      "id": "product_123",
      "name": "Premium Salary Advance",
      "description": "Short-term salary advance with competitive rates",
      "type": "SALARY",
      "interestRate": 15,
      "minimumAmount": 50000,
      "maximumAmount": 2000000
    },
    "repaymentSchedule": [
      {
        "id": "schedule_123",
        "dueDate": "2023-02-01T00:00:00Z",
        "amount": 43125,
        "principalAmount": 37500,
        "interestAmount": 5625,
        "status": "PAID",
        "paidDate": "2023-02-01T09:15:00Z"
      }
    ],
    "repaymentHistory": [
      {
        "id": "payment_123",
        "amount": 43125,
        "paymentMethod": "BANK_TRANSFER",
        "reference": "TXN-98765432",
        "paidAt": "2023-02-01T09:15:00Z",
        "notes": "Monthly repayment"
      }
    ]
  }
}
```

### Update Loan Status
**Endpoint**: `PUT /admin/loans/:id/status`  
**Description**: Updates loan status (approve, reject, activate, etc.)

**Request Body Example**:
```json
{
  "status": "APPROVED",
  "approvedAmount": 450000,
  "notes": "Approved after verification of employment"
}
```

**For Rejection**:
```json
{
  "status": "REJECTED",
  "rejectionReason": "Insufficient income documentation",
  "notes": "Customer needs to provide salary slips"
}
```

### Record Manual Repayment
**Endpoint**: `POST /admin/loans/manual-repayment`  
**Description**: Records a manual loan repayment

**Request Body Example**:
```json
{
  "loanId": "loan_123",
  "amount": 43125,
  "paymentMethod": "BANK_TRANSFER",
  "reference": "TXN-98765432",
  "notes": "Cash payment collected by agent"
}
```

### Process Bulk Repayments
**Endpoint**: `POST /admin/loans/bulk-repayments`  
**Description**: Process multiple loan repayments at once

**Request Body Example**:
```json
{
  "repayments": [
    {
      "loanId": "loan_123",
      "amount": 43125,
      "reference": "TXN-123456",
      "paymentMethod": "BANK_TRANSFER"
    },
    {
      "loanId": "loan_124",
      "amount": 52000,
      "reference": "TXN-123457",
      "paymentMethod": "BANK_TRANSFER"
    }
  ]
}
```

### Get Loan Products
**Endpoint**: `GET /admin/loans/products`  
**Description**: Returns all loan products

### Create Loan Product
**Endpoint**: `POST /admin/loans/products`  
**Description**: Creates a new loan product

**Request Body Example**:
```json
{
  "name": "Premium Salary Advance",
  "description": "Short-term salary advance with competitive rates",
  "type": "SALARY",
  "minimumAmount": 50000,
  "maximumAmount": 2000000,
  "interestRate": 15,
  "duration": 12,
  "serviceFee": 1.5,
  "processingFee": 1,
  "requiresGuarantor": false,
  "requiresCollateral": false,
  "active": true
}
```

### Update Loan Product
**Endpoint**: `PUT /admin/loans/products/:id`  
**Description**: Updates an existing loan product

---

## 📈 Investment Management

### Get All Investments
**Endpoint**: `GET /admin/investments`  
**Description**: Returns paginated list of investments with search and filters

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by reference, user name, or email
- `status` (optional): Filter by investment status
- `type` (optional): Filter by investment type (NAIRA, FOREIGN, EQUITY)

**Response Example**:
```json
{
  "success": true,
  "data": {
    "investments": [
      {
        "id": "inv_123",
        "reference": "INV-12345678",
        "name": "My Retirement Fund",
        "amount": 500000,
        "status": "ACTIVE",
        "planType": "NAIRA",
        "currency": "NGN",
        "interestRate": 18,
        "tenure": 12,
        "startDate": "2023-01-01T00:00:00Z",
        "maturityDate": "2024-01-01T00:00:00Z",
        "expectedReturns": 590000,
        "createdAt": "2023-01-01T00:00:00Z",
        "user": {
          "id": "user_123",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        },
        "plan": {
          "id": "plan_123",
          "name": "Premium Naira Investment",
          "type": "NAIRA"
        }
      }
    ],
    "pagination": {
      "total": 420,
      "page": 1,
      "limit": 10,
      "pages": 42
    }
  }
}
```

### Get Investment by ID
**Endpoint**: `GET /admin/investments/:id`  
**Description**: Returns detailed information about a specific investment

### Update Investment Status
**Endpoint**: `PUT /admin/investments/:id/status`  
**Description**: Updates investment status (approve, reject, activate, etc.)

**Request Body Example**:
```json
{
  "status": "ACTIVE",
  "notes": "Approved after payment verification"
}
```

### Get Pending Foreign Investments
**Endpoint**: `GET /admin/investments/foreign/pending`  
**Description**: Returns foreign investments pending approval

### Get Interest Rates
**Endpoint**: `GET /admin/investments/interest-rates`  
**Description**: Returns all interest rate configurations

### Create Interest Rate
**Endpoint**: `POST /admin/investments/interest-rates`  
**Description**: Creates a new interest rate configuration

**Request Body Example**:
```json
{
  "investmentType": "NAIRA",
  "minTenure": 3,
  "maxTenure": 12,
  "interestRate": 0.18,
  "active": true
}
```

### Update Interest Rate
**Endpoint**: `PUT /admin/investments/interest-rates/:id`  
**Description**: Updates an interest rate configuration

### Override Investment Interest Rate
**Endpoint**: `PUT /admin/investments/:id/override-rate`  
**Description**: Override interest rate for a specific investment

**Request Body Example**:
```json
{
  "overriddenInterestRate": 0.20,
  "reason": "Special rate for VIP customer"
}
```

---

## 💳 Wallet Management

### Get All Deposits
**Endpoint**: `GET /admin/wallet/deposits`  
**Description**: Returns all wallet deposits with pagination

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (PENDING, COMPLETED, FAILED)
- `search` (optional): Search by user or reference

**Response Example**:
```json
{
  "success": true,
  "data": {
    "deposits": [
      {
        "id": "deposit_123",
        "reference": "DEP-12345678",
        "amount": 100000,
        "status": "COMPLETED",
        "paymentMethod": "BANK_TRANSFER",
        "channel": "mono",
        "createdAt": "2023-01-01T00:00:00Z",
        "completedAt": "2023-01-01T00:05:00Z",
        "user": {
          "id": "user_123",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        }
      }
    ],
    "pagination": {
      "total": 1520,
      "page": 1,
      "limit": 10,
      "pages": 152
    }
  }
}
```

### Get Payment Channels
**Endpoint**: `GET /admin/wallet/payment-channels`  
**Description**: Returns all available payment channels and their status

### Get Withdrawal Requests
**Endpoint**: `GET /admin/wallet/withdrawals`  
**Description**: Returns all withdrawal requests with pagination

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (PENDING, COMPLETED, REJECTED)
- `search` (optional): Search by user or reference

### Process Withdrawal
**Endpoint**: `POST /admin/wallet/withdrawals/:id/process`  
**Description**: Approve or reject a withdrawal request

**Request Body Example**:
```json
{
  "approve": true,
  "notes": "Approved via bank transfer",
  "reference": "TRF-123456789"
}
```

**For Rejection**:
```json
{
  "approve": false,
  "notes": "Insufficient documentation"
}
```

---

## ⚙️ System Settings

### Get System Settings
**Endpoint**: `GET /admin/settings`  
**Description**: Returns current system settings and configurations

**Response Example**:
```json
{
  "success": true,
  "data": {
    "defaultInvestmentInterestRate": 15,
    "defaultLoanInterestRate": 18,
    "minimumInvestmentAmount": 10000,
    "defaultProcessingFee": 1,
    "maxWithdrawalPerDay": 1000000,
    "enableForeignInvestments": true,
    "autoApproveNairaInvestments": true,
    "enableUpfrontInterestPayment": true,
    "maintenanceMode": false,
    "apiRateLimit": 1000,
    "emailSettings": {
      "provider": "ZeptoMail",
      "enabled": true
    },
    "smsSettings": {
      "provider": "KudiSMS",
      "enabled": true
    }
  }
}
```

### Update System Settings
**Endpoint**: `PUT /admin/settings`  
**Description**: Updates system settings

**Request Body Example**:
```json
{
  "defaultInvestmentInterestRate": 16,
  "defaultLoanInterestRate": 19,
  "minimumInvestmentAmount": 15000,
  "maxWithdrawalPerDay": 1500000,
  "enableForeignInvestments": false
}
```

---

## 🔔 Notification Management

### Get Admin Notifications
**Endpoint**: `GET /admin/notifications`  
**Description**: Returns notifications for admin users

### Create Notification
**Endpoint**: `POST /admin/notifications`  
**Description**: Creates a new notification

**Request Body Example**:
```json
{
  "title": "System Maintenance Scheduled",
  "message": "System maintenance is scheduled for tomorrow at 2:00 AM"
}
```

### Mark Notification as Read
**Endpoint**: `PUT /admin/notifications/:id/read`  
**Description**: Marks a notification as read

### Get Unread Count
**Endpoint**: `GET /admin/notifications/unread-count`  
**Description**: Returns count of unread notifications

---

## 📚 Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ]
  }
}
```

### Pagination Format
```json
{
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "pages": 63,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🎯 Rate Limiting

All admin endpoints are subject to rate limiting:
- **Standard Admin**: 1000 requests per hour
- **Super Admin**: 2000 requests per hour
- **Bulk Operations**: 100 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1640995200
```

---

## 📞 Support & Resources

- **API Documentation**: `http://localhost:3000/api`
- **Status Page**: `https://status.litefi.ng`
- **Support Email**: `api-support@litefi.ng`

---

**Last Updated**: January 2025  
**API Version**: v1.0  
**Environment**: Production  

This documentation covers all administrative endpoints available in the LiteFi Backend system. For implementation examples and additional details, refer to the Swagger documentation at `http://localhost:3000/api`. 
