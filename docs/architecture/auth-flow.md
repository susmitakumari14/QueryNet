# Authentication Flow

This document details the complete authentication and authorization system for QueryNet, including JWT token management, security measures, and user session handling.

## Authentication Architecture Overview

```mermaid
architecture-beta
    group client(cloud)[Client Layer]
    group auth(cloud)[Authentication Layer]
    group backend(cloud)[Backend Services]
    group storage(database)[Data Storage]

    service browser(server)[Web Browser] in client
    service mobile(server)[Mobile App] in client
    
    service jwt_service(server)[JWT Service] in auth
    service oauth_provider(server)[OAuth Provider] in auth
    service session_manager(server)[Session Manager] in auth
    
    service api_gateway(server)[API Gateway] in backend
    service user_service(server)[User Service] in backend
    service auth_middleware(server)[Auth Middleware] in backend
    
    service user_db(database)[User Database] in storage
    service session_store(database)[Session Store] in storage
    service token_blacklist(database)[Token Blacklist] in storage

    browser:B --> T:jwt_service
    mobile:B --> T:oauth_provider
    
    jwt_service:B --> T:api_gateway
    oauth_provider:B --> T:api_gateway
    session_manager:B --> T:api_gateway
    
    api_gateway:R --> L:auth_middleware
    auth_middleware:R --> L:user_service
    
    user_service:B --> T:user_db
    session_manager:B --> T:session_store
    jwt_service:B --> T:token_blacklist
```

## Complete Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant AuthController
    participant UserModel
    participant JWT
    participant Database
    participant Redis
    participant Email

    Note over User,Email: User Registration Flow
    
    User->>Frontend: Fill registration form
    Frontend->>Frontend: Client-side validation
    Frontend->>API: POST /api/auth/register
    
    API->>AuthController: registerUser()
    AuthController->>UserModel: checkEmailExists()
    UserModel->>Database: Query user by email
    Database-->>UserModel: User not found
    UserModel-->>AuthController: Email available
    
    AuthController->>AuthController: Hash password with bcrypt
    AuthController->>UserModel: createUser()
    UserModel->>Database: Insert new user
    Database-->>UserModel: User created
    
    AuthController->>JWT: generateVerificationToken()
    JWT-->>AuthController: Verification token
    
    AuthController->>Email: sendVerificationEmail()
    Email-->>User: Verification email sent
    
    AuthController-->>API: Registration success
    API-->>Frontend: 201 Created
    Frontend-->>User: Check email for verification
    
    Note over User,Email: Email Verification Flow
    
    User->>Email: Click verification link
    Email->>Frontend: GET /verify-email?token=...
    Frontend->>API: POST /api/auth/verify-email
    
    API->>AuthController: verifyEmail()
    AuthController->>JWT: verifyToken()
    JWT-->>AuthController: Token valid
    
    AuthController->>UserModel: markEmailVerified()
    UserModel->>Database: Update user verification
    Database-->>UserModel: User verified
    
    AuthController-->>API: Verification success
    API-->>Frontend: Email verified
    Frontend-->>User: Redirect to login
```

## Login & JWT Token Flow

```mermaid
flowchart TD
    User_Login[👤 User Login Attempt] --> Credentials[🔑 Email/Password]
    
    subgraph "Client-Side Validation"
        Credentials --> Email_Format[📧 Email Format Check]
        Email_Format --> Password_Length[🔒 Password Length Check]
        Password_Length --> Submit_Valid[✅ Submit if Valid]
    end
    
    subgraph "Server-Side Authentication"
        Submit_Valid --> Find_User[👤 Find User in Database]
        Find_User --> User_Exists{🔍 User Exists?}
        User_Exists -->|No| Auth_Failure[❌ Authentication Failed]
        User_Exists -->|Yes| Check_Verified[✅ Check Email Verified]
        
        Check_Verified --> Verified{📧 Email Verified?}
        Verified -->|No| Verification_Required[📧 Verification Required]
        Verified -->|Yes| Password_Check[🔒 Password Verification]
        
        Password_Check --> Hash_Compare[🔐 bcrypt.compare()]
        Hash_Compare --> Match{✅ Password Match?}
        Match -->|No| Auth_Failure
        Match -->|Yes| Generate_Tokens[🎫 Generate Tokens]
    end
    
    subgraph "Token Generation"
        Generate_Tokens --> Access_Token[🎫 Access Token (15min)]
        Generate_Tokens --> Refresh_Token[🔄 Refresh Token (7 days)]
        Access_Token --> JWT_Payload[📋 JWT Payload]
        Refresh_Token --> Redis_Store[🔴 Store in Redis]
    end
    
    subgraph "Response & Storage"
        JWT_Payload --> HTTP_Only_Cookie[🍪 HTTP-Only Cookie]
        Redis_Store --> Session_Data[📊 Session Data]
        HTTP_Only_Cookie --> Auth_Success[✅ Authentication Success]
        Session_Data --> Auth_Success
    end
    
    Auth_Failure --> Error_Response[❌ Error Response]
    Verification_Required --> Resend_Email[📧 Resend Verification]
    Auth_Success --> User_Dashboard[📊 User Dashboard]
```

## JWT Token Structure & Management

```mermaid
classDiagram
    class JWT_Payload {
        +string userId
        +string email
        +string username
        +string role
        +number iat
        +number exp
        +string tokenType
        +string sessionId
    }
    
    class Access_Token {
        +string type = "access"
        +number expiry = 15min
        +string[] permissions
        +validateToken()
        +isExpired()
    }
    
    class Refresh_Token {
        +string type = "refresh"
        +number expiry = 7days
        +string deviceId
        +string ipAddress
        +rotateToken()
        +revokeToken()
    }
    
    class Token_Manager {
        +generateAccessToken()
        +generateRefreshToken()
        +validateToken()
        +refreshTokens()
        +revokeToken()
        +blacklistToken()
    }
    
    JWT_Payload <|-- Access_Token
    JWT_Payload <|-- Refresh_Token
    Token_Manager --> Access_Token
    Token_Manager --> Refresh_Token
```

## Authorization & Permission System

```mermaid
flowchart TD
    API_Request[🌐 API Request] --> Extract_Token[🎫 Extract JWT Token]
    
    subgraph "Token Validation"
        Extract_Token --> Token_Present{🎫 Token Present?}
        Token_Present -->|No| Unauthorized[❌ 401 Unauthorized]
        Token_Present -->|Yes| Verify_Signature[✅ Verify JWT Signature]
        
        Verify_Signature --> Valid_Signature{✅ Valid Signature?}
        Valid_Signature -->|No| Invalid_Token[❌ Invalid Token]
        Valid_Signature -->|Yes| Check_Expiry[⏰ Check Expiration]
        
        Check_Expiry --> Expired{⏰ Token Expired?}
        Expired -->|Yes| Token_Expired[❌ Token Expired]
        Expired -->|No| Check_Blacklist[🚫 Check Blacklist]
        
        Check_Blacklist --> Blacklisted{🚫 Token Blacklisted?}
        Blacklisted -->|Yes| Token_Revoked[❌ Token Revoked]
        Blacklisted -->|No| Extract_User[👤 Extract User Info]
    end
    
    subgraph "Authorization Check"
        Extract_User --> Load_User[👤 Load User from Database]
        Load_User --> User_Active{✅ User Active?}
        User_Active -->|No| Account_Disabled[❌ Account Disabled]
        User_Active -->|Yes| Check_Permissions[🔑 Check Permissions]
        
        Check_Permissions --> Resource_Access{🚪 Has Access?}
        Resource_Access -->|No| Forbidden[❌ 403 Forbidden]
        Resource_Access -->|Yes| Authorized[✅ Authorized]
    end
    
    subgraph "Error Responses"
        Unauthorized --> Login_Required[🔑 Login Required]
        Invalid_Token --> Login_Required
        Token_Expired --> Refresh_Required[🔄 Refresh Required]
        Token_Revoked --> Login_Required
        Account_Disabled --> Contact_Support[📞 Contact Support]
        Forbidden --> Access_Denied[🚫 Access Denied]
    end
    
    Authorized --> Process_Request[✅ Process Request]
    Refresh_Required --> Refresh_Flow[🔄 Token Refresh Flow]
```

## Token Refresh Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant API
    participant AuthMiddleware
    participant JWT
    participant Redis
    participant Database

    Frontend->>API: API Request with expired token
    API->>AuthMiddleware: Process request
    AuthMiddleware->>JWT: Validate access token
    JWT-->>AuthMiddleware: Token expired
    
    AuthMiddleware-->>API: 401 Token Expired
    API-->>Frontend: 401 with refresh instruction
    
    Frontend->>Frontend: Check for refresh token
    Frontend->>API: POST /api/auth/refresh
    
    API->>AuthMiddleware: Validate refresh token
    AuthMiddleware->>JWT: Verify refresh token
    JWT-->>AuthMiddleware: Valid refresh token
    
    AuthMiddleware->>Redis: Check refresh token exists
    Redis-->>AuthMiddleware: Token found
    
    AuthMiddleware->>Database: Get user details
    Database-->>AuthMiddleware: User data
    
    AuthMiddleware->>JWT: Generate new access token
    JWT-->>AuthMiddleware: New access token
    
    AuthMiddleware->>JWT: Generate new refresh token
    JWT-->>AuthMiddleware: New refresh token
    
    AuthMiddleware->>Redis: Store new refresh token
    AuthMiddleware->>Redis: Invalidate old refresh token
    Redis-->>AuthMiddleware: Tokens updated
    
    AuthMiddleware-->>API: New tokens
    API-->>Frontend: 200 with new tokens
    
    Frontend->>Frontend: Update stored tokens
    Frontend->>API: Retry original request
    API-->>Frontend: Original request processed
```

## Multi-Device Session Management

```mermaid
graph TD
    subgraph "User Sessions"
        User[👤 User Account] --> Desktop[💻 Desktop Session]
        User --> Mobile[📱 Mobile Session]
        User --> Tablet[📱 Tablet Session]
        User --> Browser2[🌐 Another Browser]
    end
    
    subgraph "Session Tracking"
        Desktop --> Session1[📊 Session 1]
        Mobile --> Session2[📊 Session 2]
        Tablet --> Session3[📊 Session 3]
        Browser2 --> Session4[📊 Session 4]
    end
    
    subgraph "Session Data"
        Session1 --> Device_Info1[📱 Device: Desktop Chrome]
        Session1 --> IP1[🌐 IP: 192.168.1.100]
        Session1 --> Last_Active1[⏰ Last Active: 2min ago]
        
        Session2 --> Device_Info2[📱 Device: Mobile Safari]
        Session2 --> IP2[🌐 IP: 192.168.1.101]
        Session2 --> Last_Active2[⏰ Last Active: 1hr ago]
    end
    
    subgraph "Session Management"
        User --> View_Sessions[👀 View Active Sessions]
        View_Sessions --> Revoke_Session[❌ Revoke Session]
        View_Sessions --> Revoke_All[❌ Revoke All Others]
        
        Revoke_Session --> Blacklist_Token[🚫 Blacklist Token]
        Revoke_All --> Blacklist_All[🚫 Blacklist All Tokens]
    end
    
    subgraph "Security Monitoring"
        Session1 --> Geo_Check[🌍 Geolocation Check]
        Session2 --> Device_Check[📱 Device Fingerprint]
        Session3 --> Suspicious_Activity[⚠️ Suspicious Activity]
        
        Geo_Check --> Location_Alert[🚨 New Location Alert]
        Device_Check --> Device_Alert[🚨 New Device Alert]
        Suspicious_Activity --> Security_Alert[🚨 Security Alert]
    end
```

## OAuth Integration (Future)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant QueryNet
    participant OAuth_Provider
    participant Database

    Note over User,Database: OAuth Login Flow (Google/GitHub)
    
    User->>Frontend: Click "Login with Google"
    Frontend->>OAuth_Provider: Redirect to OAuth authorization
    OAuth_Provider->>User: Show consent screen
    User->>OAuth_Provider: Grant permission
    
    OAuth_Provider->>Frontend: Redirect with authorization code
    Frontend->>QueryNet: POST /api/auth/oauth/callback
    
    QueryNet->>OAuth_Provider: Exchange code for tokens
    OAuth_Provider-->>QueryNet: Access token & user info
    
    QueryNet->>Database: Find or create user
    Database-->>QueryNet: User record
    
    QueryNet->>QueryNet: Generate internal JWT tokens
    QueryNet-->>Frontend: Authentication success
    Frontend-->>User: Logged in successfully
    
    Note over User,Database: Account Linking
    
    alt Existing account
        QueryNet->>User: Link OAuth account?
        User->>QueryNet: Confirm linking
        QueryNet->>Database: Link OAuth profile
    else New account
        QueryNet->>Database: Create new user with OAuth
    end
```

## Security Measures & Threat Protection

```mermaid
flowchart TD
    subgraph "Input Security"
        User_Input[👤 User Input] --> Sanitization[🧼 Input Sanitization]
        Sanitization --> XSS_Prevention[🛡️ XSS Prevention]
        XSS_Prevention --> CSRF_Protection[🛡️ CSRF Protection]
        CSRF_Protection --> SQL_Injection[🛡️ SQL Injection Prevention]
    end
    
    subgraph "Authentication Security"
        Password_Policy[🔒 Password Policy] --> Strong_Passwords[💪 Strong Passwords]
        Strong_Passwords --> Hash_Storage[🔐 bcrypt Hashing]
        Hash_Storage --> Salt_Rounds[🧂 12 Salt Rounds]
        Salt_Rounds --> Rate_Limiting[⏱️ Rate Limiting]
    end
    
    subgraph "Session Security"
        JWT_Security[🎫 JWT Security] --> Short_Expiry[⏰ Short Access Token Expiry]
        Short_Expiry --> Token_Rotation[🔄 Token Rotation]
        Token_Rotation --> Secure_Storage[🔒 Secure Storage]
        Secure_Storage --> HTTP_Only[🍪 HTTP-Only Cookies]
    end
    
    subgraph "Monitoring & Detection"
        Failed_Attempts[❌ Failed Login Attempts] --> Account_Lockout[🔒 Account Lockout]
        Account_Lockout --> Suspicious_Activity[⚠️ Suspicious Activity Detection]
        Suspicious_Activity --> IP_Blocking[🚫 IP Blocking]
        IP_Blocking --> Security_Alerts[🚨 Security Alerts]
    end
    
    subgraph "Data Protection"
        Data_Encryption[🔒 Data Encryption] --> TLS_Transit[🔐 TLS in Transit]
        TLS_Transit --> AES_Rest[🔐 AES at Rest]
        AES_Rest --> Key_Management[🗝️ Key Management]
        Key_Management --> Backup_Security[💾 Secure Backups]
    end
```

## Password Reset Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant AuthController
    participant Database
    participant Email
    participant JWT

    User->>Frontend: Click "Forgot Password"
    Frontend->>Frontend: Show email input form
    User->>Frontend: Enter email address
    Frontend->>API: POST /api/auth/forgot-password
    
    API->>AuthController: initiateForgotPassword()
    AuthController->>Database: Find user by email
    Database-->>AuthController: User found/not found
    
    Note over AuthController: Always return success for security
    
    alt User exists
        AuthController->>JWT: Generate reset token (1hr expiry)
        JWT-->>AuthController: Reset token
        
        AuthController->>Database: Store reset token hash
        Database-->>AuthController: Token stored
        
        AuthController->>Email: Send reset email
        Email-->>User: Password reset email
    end
    
    AuthController-->>API: Success (regardless of user existence)
    API-->>Frontend: Password reset email sent
    Frontend-->>User: Check your email
    
    Note over User,JWT: Password Reset Completion
    
    User->>Email: Click reset link
    Email->>Frontend: GET /reset-password?token=...
    Frontend->>Frontend: Show new password form
    User->>Frontend: Enter new password
    Frontend->>API: POST /api/auth/reset-password
    
    API->>AuthController: resetPassword()
    AuthController->>JWT: Verify reset token
    JWT-->>AuthController: Token valid/invalid
    
    alt Token valid
        AuthController->>Database: Check token not used
        Database-->>AuthController: Token unused
        
        AuthController->>AuthController: Hash new password
        AuthController->>Database: Update password & invalidate token
        Database-->>AuthController: Password updated
        
        AuthController->>Database: Revoke all user sessions
        Database-->>AuthController: Sessions revoked
        
        AuthController-->>API: Password reset success
        API-->>Frontend: Password reset successful
        Frontend-->>User: Login with new password
    else Token invalid/expired
        AuthController-->>API: Invalid or expired token
        API-->>Frontend: Reset link invalid
        Frontend-->>User: Please request new reset link
    end
```

## Security Metrics & Monitoring

### Authentication Metrics
- **Login Success Rate**: > 95%
- **Failed Login Attempts**: < 5% of total attempts
- **Account Lockouts**: < 1% of active users
- **Password Reset Requests**: < 2% of users per month

### Token Security
- **JWT Token Compromises**: 0 per month
- **Token Refresh Success**: > 99%
- **Session Duration**: Average 2 hours
- **Multi-device Sessions**: Average 2.3 per user

### Security Incidents
- **Brute Force Attempts**: Blocked automatically
- **Suspicious Login Alerts**: < 0.1% false positives
- **Account Takeover Attempts**: 0 successful attempts
- **Data Breach Incidents**: 0 tolerance policy

---

*This authentication flow documentation ensures secure, user-friendly access control for the QueryNet platform.*
