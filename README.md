# S3 & CloudFront Image Upload Solution

A full-stack image uploading application built with React, Node.js/Express, MongoDB, and AWS S3.

## Features

- 🔐 User authentication (Register/Login)
- 📤 Image upload to AWS S3
- 🖼️ Image gallery with grid view
- 🗑️ Delete images (owner only)
- ☁️ CloudFront or direct S3 URL support
- 📱 Fully responsive design
- ✨ Modern, beautiful UI with animations

## Tech Stack

### Backend
- **Runtime:** Bun
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Storage:** AWS S3
- **Authentication:** JWT
- **File Upload:** Multer + Multer-S3

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** CSS with modern gradients and animations

## Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- MongoDB Atlas account or local MongoDB
- AWS account with S3 bucket created
- AWS IAM credentials with S3 permissions

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
bun install

# Configure environment variables
# Edit backend/.env and add your credentials:
# - MongoDB URI (already configured)
# - AWS credentials (Access Key ID, Secret Access Key, Bucket Name, Region)
# - JWT secret

# Start the backend server
bun run dev
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
bun install

# Start the development server
bun run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)

```env
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://neverlearnacademy:Neverlearn2024@neverlearn.lk0wklk.mongodb.net/s3-crud?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name

# CloudFront Configuration (Optional - leave empty to use direct S3 URLs)
CLOUDFRONT_DOMAIN=

# Upload Configuration
MAX_FILE_SIZE=10485760
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

## AWS S3 Setup

1. **Create an S3 Bucket:**
   - Go to AWS S3 Console
   - Create a new bucket
   - Enable public access if using direct S3 URLs (or use CloudFront)

2. **Configure Bucket Permissions:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

3. **Create IAM User:**
   - Create an IAM user with programmatic access
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
   - Save Access Key ID and Secret Access Key

4. **Optional - CloudFront Setup:**
   - Create a CloudFront distribution
   - Set S3 bucket as origin
   - Add CloudFront domain to backend `.env`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Images
- `GET /api/images` - Get all images (with pagination)
- `GET /api/images/user/:userId` - Get user's images
- `POST /api/images` - Upload image (requires authentication)
- `DELETE /api/images/:id` - Delete image (requires authentication, owner only)

## Usage

1. **Register/Login:**
   - Create a new account or login with existing credentials

2. **Upload Images:**
   - Click "Upload Image" button
   - Drag & drop or browse for an image
   - Add optional title and description
   - Click "Upload Image"

3. **View Gallery:**
   - Browse all uploaded images
   - Filter by "All Images" or "My Images"
   - Click on any image to view fullscreen

4. **Delete Images:**
   - Only your own images will show a delete button
   - Click "Delete" and confirm to remove

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and AWS configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth and error middleware
│   ├── models/          # Mongoose models
│   └── routes/          # API routes
├── index.ts             # Server entry point
└── .env                 # Environment variables

frontend/
├── src/
│   ├── components/      # React components
│   ├── context/         # Auth context
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
└── .env                 # Environment variables
```

## Production Deployment

### Backend
```bash
# Build and run
cd backend
bun install --production
bun run start
```

### Frontend
```bash
# Build for production
cd frontend
bun run build

# Preview production build
bun run preview
```

## Security Notes

- ⚠️ Change JWT_SECRET in production
- ⚠️ Use environment-specific AWS credentials
- ⚠️ Configure CORS properly for production domains
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for production

## License

MIT

## Author

Built with ❤️ using React, Express, MongoDB, and AWS S3
