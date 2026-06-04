# Project Title

A brief description of your project.

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About The Project

This project is a full-stack web application with a React frontend and a Node.js backend.

### Tech Stack

**Client:**

- React
- Vite
- Tailwind CSS
- Shadcn UI
- React Router

**Server:**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT for authentication

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```
- Node.js
- MongoDB

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/soukaina-hammou/PFF.git
   ```
2. Install NPM packages for the server
   ```sh
   cd server
   npm install
   ```
3. Install NPM packages for the client
   ```sh
   cd ../client
   npm install
   ```
4. Create a `.env` file in the `server` directory and add the following variables:
   ```
   PORT=5000
   MONGO_URI=<YOUR_MONGO_URI>
   JWT_SECRET=<YOUR_JWT_SECRET>
   ```

### Running the Application

1. Start the server
   ```sh
   cd server
   npm run dev
   ```
2. Start the client
   ```sh
   cd ../client
   npm run dev
   ```

## Project Structure

```
.
├── client/               # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
│   ├── public/
│   ├── package.json
│   └── ...
└── server/               # Node.js backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

## API Endpoints

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.
- `GET /api/auth/me`: Get the current user's information.

## License

Distributed under the MIT License. See `LICENSE` for more information.
