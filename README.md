# E-Commerce Tax Calculator

A full-stack application to calculate sales tax for digital products across multiple jurisdictions.

## Features

- Calculate sales tax for digital products based on jurisdiction
- Store and manage tax rates and rules
- Track transaction history
- Generate transaction reports
- User-friendly interface for tax management

## Tech Stack

- Frontend: React, TypeScript
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Testing: Jest

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/E-Commerce-Tax-Calculator.git
   cd E-Commerce-Tax-Calculator
   ```

2. Install dependencies
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up the database
   ```
   # Create database and run migrations
   cd ../database
   npm run setup
   ```

4. Start the development servers
   ```
   # Start backend server
   cd ../server
   npm run dev

   # Start frontend server (in a new terminal)
   cd ../client
   npm start
   ```

## Project Structure

- `client/`: React frontend application
- `server/`: Node.js backend API
- `database/`: Database scripts and migrations
- `docs/`: Project documentation

## License

MIT