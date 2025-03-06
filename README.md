# E-Commerce Tax Calculator

A comprehensive tax calculation solution for e-commerce businesses, helping them navigate complex tax regulations across different jurisdictions.



## Features

- **Tax Calculator**: Calculate taxes for products based on jurisdiction and product type
- **Transaction History**: View and manage past transactions
- **Jurisdiction Management**: Add, edit, and delete tax jurisdictions
- **Tax Rate Management**: Configure tax rates for different product types and jurisdictions
- **Tax Rule Management**: Set up special tax rules and exemptions
- **PostgreSQL Database**: Persistent storage for all tax data with robust relational capabilities

## Technology Stack

### Frontend
- React.js
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (Node PostgreSQL driver)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL (v12 or higher, included in Docker setup)

## Installation

### Using Docker (Recommended)

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ecommerce-tax-calculator.git
   cd ecommerce-tax-calculator
   ```

2. Start the application using Docker Compose
   ```
   docker-compose up
   ```

   This will:
   - Set up a PostgreSQL database
   - Initialize the database schema and sample data
   - Start the backend server
   - Start the frontend development server

3. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: PostgreSQL running on port 5432

### Manual Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ecommerce-tax-calculator.git
   cd ecommerce-tax-calculator
   ```

2. Set up PostgreSQL
   - Install PostgreSQL if not already installed
   - Create a database named `tax_calculator`
   - Run the initialization script: `psql -U postgres -d tax_calculator -f server/src/db/init.sql`

3. Install backend dependencies and start the server
   ```
   cd server
   npm install
   npm start
   ```

4. Install frontend dependencies and start the client
   ```
   cd client
   npm install
   npm start
   ```

5. Access the application at http://localhost:3000

## Database Schema

The application uses PostgreSQL with the following schema:

- **jurisdictions**: Stores tax jurisdictions (countries, states, etc.)
- **tax_rates**: Contains tax rates for different product types in each jurisdiction
- **tax_rules**: Defines special tax rules and exemptions
- **transactions**: Records completed tax calculations

## Environment Variables

### Backend
Create a `.env` file in the server directory with the following variables:
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tax_calculator
```

### Frontend
Create a `.env` file in the client directory with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Usage

1. **Tax Calculator**: Enter customer location and product details to calculate applicable taxes
2. **Jurisdiction Management**: Add and manage tax jurisdictions
3. **Tax Rate Management**: Configure tax rates for different product types
4. **Transaction History**: View past tax calculations
5. **Database Status**: Check PostgreSQL connection status at /db-status

## Development

### Database Migrations

The initial database schema is created using the `init.sql` script. For future schema changes, consider implementing a migration system using tools like:
- node-pg-migrate
- Sequelize migrations
- Knex.js migrations

### Testing Database Connection

You can verify the PostgreSQL connection is working by:
1. Visiting the Database Status page in the application (/db-status)
2. Checking server logs for database connection messages
3. Performing CRUD operations in the Jurisdiction Management page

## Deployment

### Production Deployment

1. Update environment variables for production
2. Build the frontend
   ```
   cd client
   npm run build
   ```
3. Transfer the build files to your web server
4. Configure your server to serve the static files
5. Set up any necessary environment variables
6. Ensure PostgreSQL is properly secured for production use

## License

This project is licensed under the MIT License

## Acknowledgments

- [React.js](https://reactjs.org/) - Frontend library
- [React Router](https://reactrouter.com/) - Routing library
- [Axios](https://axios-http.com/) - HTTP client
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [pg](https://node-postgres.com/) - PostgreSQL client for Node.js