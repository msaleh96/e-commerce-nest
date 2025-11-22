# E-Commerce Review & Rating API

A simple NestJS app for learning how to build product reviews and ratings with MongoDB.

---

## Features

- Create or update product ratings by users  
- Create or update product reviews by users  
- Delete user reviews  
- Paginated product list with reviews populated  
- Automatic average rating update per product  

---

## Technologies

- NestJS  
- Mongoose (MongoDB ODM)  
- MongoDB  
- class-validator  
- dotenv  

---

## Getting Started

### Prerequisites

- Node.js (v16 or later)  
- MongoDB installed and running locally  
- npm  

---

### Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/msaleh96/e-commerce-nest.git
cd e-commerce-nest
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/e-commerce
JWT_SECRET=msaleh01550191001
```

4. Make sure MongoDB is running locally:

- On Windows, start the MongoDB service via Services or command line  
- On Linux/macOS, run `mongod` or use your system’s service manager  

---

### Run the Application

```bash
npm run start:dev
```

The app will start on `http://localhost:3000` by default.

---

## Project Structure Overview

- `src/modules/product` — product schema, service, and controllers  
- `src/modules/review` — review schema, service, and controllers  
- `src/modules/rating` — rating schema, service, and controllers  
- `src/modules/user` — user module (authentication optional)  
- `src/app.module.ts` — root module loading config and database connection  

---

## Notes

- Uses **virtual populate** for reviews inside products  
- Validates inputs using DTOs and class-validator  
- Automatically recalculates average rating on create/update/delete rating  

---

## License

This project is for learning and personal use.

---
