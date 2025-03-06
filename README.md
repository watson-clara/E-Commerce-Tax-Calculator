# E-Commerce Tax Calculator

A comprehensive solution for calculating sales tax for digital products across multiple jurisdictions.

## Features

- **Tax Calculation**: Calculate accurate sales tax for digital products based on customer location and product type.
- **Jurisdiction Management**: Manage tax jurisdictions, rates, and special rules for different regions.
- **Transaction History**: Track and review past transactions with detailed tax information.
- **Reporting**: Generate tax reports for compliance and financial planning.

## Technology Stack

- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecommerce-tax-calculator.git
   cd ecommerce-tax-calculator
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up the database:
   ```bash
   # Create the database
   createdb ecommerce_tax_calculator

   # Run the schema script
   psql -d ecommerce_tax_calculator -f database/schema.sql
   ```

4. Configure environment variables:
   ```bash
   # In the server directory, create a .env file
   cd ../server
   touch .env
   ```

   Add the following to the .env file:
   ```
   PORT=5000
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecommerce_tax_calculator
   ```

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the client:
   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Documentation

### Tax Calculation

- **POST /api/calculator/calculate**
  - Calculate tax for products based on customer location
  - Request body:
    ```json
    {
      "products": [
        {
          "name": "Software License",
          "type": "Digital Software",
          "price": 99.99,
          "quantity": 1
        }
      ],
      "customerLocation": {
        "country": "US",
        "state": "CA"
      }
    }
    ```
  - Response:
    ```json
    {
      "subtotal": "99.99",
      "taxRate": 8.5,
      "taxAmount": "8.50",
      "total": "108.49",
      "jurisdiction": "California"
    }
    ```

### Jurisdictions

- **GET /api/jurisdictions**
  - Get all jurisdictions
- **POST /api/jurisdictions**
  - Create a new jurisdiction
- **PUT /api/jurisdictions/:id**
  - Update a jurisdiction
- **DELETE /api/jurisdictions/:id**
  - Delete a jurisdiction

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Tax rate information is for demonstration purposes only
- Icons provided by [FontAwesome](https://fontawesome.com/)