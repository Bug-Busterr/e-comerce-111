# E-Commerce API

A comprehensive RESTful API for e-commerce applications built with Node.js, Express.js, and MongoDB. This API provides complete functionality for managing users, products, orders, shopping carts, discounts, categories, and wishlists with robust authentication and authorization.

## 🚀 Features

### Core Functionality

- **User Management**: Registration, login, profile management, password updates
- **Product Management**: CRUD operations with categories, inventory tracking
- **Order Management**: Order creation, status tracking, discount application
- **Shopping Cart**: Full cart functionality with real-time price calculations
- **Discount System**: Coupon codes with validation and automatic application
- **Category Management**: Product categorization and organization
- **Wishlist**: Save favorite products for later
- **File Upload**: Cloudinary integration for image management

### Security & Authentication

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and User roles with specific permissions
- **Password Encryption**: Bcrypt hashing for secure password storage
- **CORS Protection**: Cross-origin resource sharing configuration
- **Helmet Security**: HTTP headers security middleware

### Data Validation

- **Joi Validation**: Comprehensive input validation for all endpoints
- **MongoDB Schema Validation**: Database-level data integrity
- **Error Handling**: Global error handling with detailed error messages

## 📋 Table of Contents

- [🛠 Installation](#-installation)
- [🌍 Environment Setup](#-environment-setup)
- [📚 API Documentation](#-api-documentation)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Products](#products)
  - [Orders](#orders)
  - [Cart](#cart)
  - [Discounts](#discounts)
  - [Categories](#categories)
  - [Wishlist](#wishlist)
  - [Upload](#upload)
- [🗄️ Database Schema](#️-database-schema)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🛠 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bug-Busterr/e-comerce-111
   cd E-Commerce-Api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database
   MONGODB_URL=mongodb://localhost:27017/ecommerce
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

5. **Start the server**

   ```bash
   # Development
   npm run run:dev
   
   # Production
   npm start
   ```

## 🌍 Environment Setup

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URL` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token generation | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for file uploads | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## 📚 API Documentation

### Base URL

```text
Development: http://localhost:3000/api
Production: https://e-comerce-111.vercel.app/api
```

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```text
Authorization: Bearer <your-jwt-token>
```

#### Register User

```http
POST /auth/register
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01234567890",
  "password": "password123",
  "avatar": <file> (optional)
}
```

#### Login

```http
POST /auth/login

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Users

#### Get All Users

```http
GET /auth?limit=10&page=1
Authorization: Bearer <token>
```

#### Get User Profile

```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Password

```http
POST /auth/updatePassword
Authorization: Bearer <token>

{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword",
  "confirmPassword": "newPassword"
}
```

#### Forgot Password

```http
PATCH /auth/forgotPassword

{
  "email": "john@example.com",
  "newPassword": "newPassword123",
  "confirmNewPassword": "newPassword123"
}
```

### Products

#### Get All Products

```http
GET /auth/admin/products?limit=10&page=1&search=laptop&sort=price_asc
```

#### Get Product by ID

```http
GET /auth/admin/products/{productId}
```

#### Get Products by Category

```http
GET /auth/admin/products/category/{categoryId}
```

#### Create Product (Admin Only)

```http
POST /auth/admin/products
Authorization: Bearer <admin-token>

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "stockQuantity": 50,
  "category": "categoryId",
  "images": ["image1.jpg", "image2.jpg"]
}
```

#### Update Product (Admin Only)

```http
PATCH /auth/admin/products/{productId}
Authorization: Bearer <admin-token>

{
  "name": "Updated Laptop",
  "price": 899.99,
  "stockQuantity": 45
}
```

#### Delete Product (Admin Only)

```http
DELETE /auth/admin/products/{productId}
Authorization: Bearer <admin-token>
```

### Orders

#### Get All Orders (Admin Only)

```http
GET /auth/admin/orders?limit=10&page=1&status=Pending&search=john
Authorization: Bearer <admin-token>
```

#### Get Order by ID

```http
GET /auth/admin/orders/{orderId}
Authorization: Bearer <token>
```

#### Create Order

```http
POST /auth/admin/orders
Authorization: Bearer <token>

{
  "buyerId": "userId",
  "products": [
    {
      "product": "productId",
      "quantity": 2
    }
  ],
  "productShippingDetails": {
    "address": "123 Main St, City, Country",
    "phone": "01234567890"
  },
  "discountCode": "SAVE20" (optional)
}
```

#### Update Order (Admin Only)

```http
PATCH /auth/admin/orders/{orderId}
Authorization: Bearer <admin-token>

{
  "status": "Shipped",
  "products": [
    {
      "product": "productId",
      "quantity": 1
    }
  ]
}
```

#### Delete Order (Admin Only)

```http
DELETE /auth/admin/orders/{orderId}
Authorization: Bearer <admin-token>
```

#### Validate Discount Code

```http
POST /auth/admin/orders/validate-discount

{
  "discountCode": "SAVE20"
}
```

#### Preview Discount

```http
POST /auth/admin/orders/preview-discount

{
  "products": [
    {
      "product": "productId",
      "quantity": 2
    }
  ],
  "discountCode": "SAVE20"
}
```

### Cart

#### Get Cart

```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart

```http
POST /cart
Authorization: Bearer <token>

{
  "productId": "productId",
  "quantity": 2
}
```

#### Update Cart Item

```http
PUT /cart
Authorization: Bearer <token>

{
  "productId": "productId",
  "quantity": 3
}
```

#### Remove Item from Cart

```http
DELETE /cart/item/{productId}
Authorization: Bearer <token>
```

#### Clear Cart

```http
DELETE /cart
Authorization: Bearer <token>
```

### Discounts

#### Get All Discounts (Admin Only)

```http
GET /auth/admin/discounts
Authorization: Bearer <admin-token>
```

#### Get Discount by ID (Admin Only)

```http
GET /auth/admin/discounts/{discountId}
Authorization: Bearer <admin-token>
```

#### Create Discount (Admin Only)

```http
POST /auth/admin/discounts
Authorization: Bearer <admin-token>

{
  "code": "SAVE20",
  "percentage": 20,
  "description": "20% off all items",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "isActive": true
}
```

#### Update Discount (Admin Only)

```http
PUT /auth/admin/discounts/{discountId}
Authorization: Bearer <admin-token>

{
  "percentage": 25,
  "description": "Updated discount"
}
```

#### Delete Discount (Admin Only)

```http
DELETE /auth/admin/discounts/{discountId}
Authorization: Bearer <admin-token>
```

### Categories

#### Get All Categories

```http
GET /auth/admin/categories
```

#### Get Category by ID

```http
GET /auth/admin/categories/{categoryId}
```

#### Create Category (Admin Only)

```http
POST /auth/admin/categories

{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

#### Update Category (Admin Only)

```http
PUT /auth/admin/categories/{categoryId}

{
  "name": "Updated Electronics",
  "description": "Updated description"
}
```

#### Delete Category (Admin Only)

```http
DELETE /auth/admin/categories/{categoryId}
```

### Wishlist

#### Get Wishlist

```http
GET /wishlists
Authorization: Bearer <token>
```

#### Add to Wishlist

```http
GET /wishlists/{productId}
Authorization: Bearer <token>
```

#### Remove from Wishlist

```http
DELETE /wishlists/{productId}
Authorization: Bearer <token>
```

### Upload

#### Upload Image (Admin Only)

```http
POST /auth/admin/uploads
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

{
  "image": <file>
}
```

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (unique, sparse),
  phone: String (unique, sparse),
  password: String (required, hashed),
  role: String (enum: ["USER", "ADMIN"], default: "USER"),
  avatar: String (default: "uploads/profile.png"),
  token: String
}
```

### Product Model

```javascript
{
  name: String (required),
  description: String,
  price: Number (required, min: 0),
  stockQuantity: Number (required, min: 0),
  inStock: Boolean (default: true),
  category: ObjectId (ref: Category, required),
  images: Array of Strings,
  deleted: Boolean (default: false),
  timestamps: true
}
```

### Order Model

```javascript
{
  buyer: ObjectId (ref: User, required),
  products: [{
    product: ObjectId (ref: Product, required),
    quantity: Number (required)
  }],
  productShippingDetails: {
    address: String (required),
    phone: String (required)
  },
  status: String (enum: ["Pending", "Shipped", "Delivered", "Canceled"]),
  discountCode: String,
  discountAmount: Number (default: 0),
  originalAmount: Number (required),
  totalAmount: Number (required),
  deleted: Boolean (default: false),
  timestamps: true
}
```

### Cart Model

```javascript
{
  buyer: ObjectId (ref: User, required, unique),
  items: [{
    product: ObjectId (ref: Product, required),
    quantity: Number (required, min: 1, default: 1)
  }],
  totalPrice: Number (default: 0),
  deleted: Boolean (default: false),
  timestamps: true
}
```

### Discount Model

```javascript
{
  code: String (required, unique),
  percentage: Number (required, min: 0, max: 100),
  description: String,
  expiresAt: Date (default: 30 days from creation),
  isActive: Boolean (default: true),
  inactive: Boolean (default: false),
  inactiveUntil: Date,
  timestamps: true
}
```

### Category Model

```javascript
{
  name: String (required, unique),
  description: String (default: ""),
  isDeleted: Boolean (default: false),
  timestamps: true
}
```

### Wishlist Model

```javascript
{
  user: ObjectId (ref: User, required),
  products: [ObjectId] (ref: Product)
}
```

## 🚀 Deployment

### Vercel Deployment

The application is configured for deployment on Vercel with the following configuration:

```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["iad1"]
}
```

### Deployment Steps

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   Configure the following environment variables in Vercel dashboard:
   - `MONGODB_URL`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add your IP to the whitelist
4. Create a database user
5. Get the connection string and add it to your environment variables

## 📊 API Response Format

### Success Response

```json
{
  "status": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "data": null
}
```

### Validation Error Response

```json
[
  {
    "message": "Field validation error",
    "field": "fieldName"
  }
]
```

## 🔒 Security Features

- **JWT Authentication**: Stateless authentication with expiring tokens
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Role-Based Access Control**: Separate permissions for users and administrators
- **Input Validation**: Joi schemas for all request validation
- **CORS Configuration**: Controlled cross-origin access
- **Helmet Security**: HTTP security headers
- **MongoDB Injection Protection**: Mongoose ODM prevents injection attacks

## 🧪 Testing

### API Testing with Postman

1. Import the API collection (if available)
2. Set up environment variables for base URL and authentication tokens
3. Test all endpoints with various scenarios

### Manual Testing

1. **User Registration & Authentication**
   - Register new users
   - Login with valid/invalid credentials
   - Access protected routes

2. **Product Management**
   - Create, read, update, delete products
   - Test category associations
   - Verify stock management

3. **Order Processing**
   - Create orders with multiple products
   - Apply discount codes
   - Test order status updates

4. **Cart Functionality**
   - Add/remove items
   - Update quantities
   - Verify price calculations

## 🐛 Error Handling

The API implements comprehensive error handling:

- **Global Error Handler**: Catches and formats all errors
- **Async Wrapper**: Handles async/await errors in route handlers
- **Custom Error Classes**: Specific error types for different scenarios
- **Validation Errors**: Detailed field-level validation messages
- **Database Errors**: Handles MongoDB connection and query errors

## 📈 Performance Considerations

- **Database Indexing**: Strategic indexes for frequently queried fields
- **Connection Pooling**: MongoDB connection pool configuration
- **Error Handling**: Graceful error handling without server crashes
- **Validation**: Input validation to prevent malformed requests
- **Soft Deletes**: Maintain data integrity while supporting delete functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code structure and naming conventions
- Add appropriate validation for new endpoints
- Include error handling for all scenarios
- Update documentation for new features
- Test all functionality before submitting

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 📄 License

This project is licensed under the ISC License.

---

## 🎯 Getting Started Quick Guide

1. **Clone & Install**

   ```bash
   git clone <repo-url>
   cd E-Commerce-Api
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Start Development**

   ```bash
   npm run run:dev
   ```

4. **Test API**

   ```bash
   curl http://localhost:3000/api/auth/admin/products
   ```

Your E-Commerce API is now ready! 🚀

