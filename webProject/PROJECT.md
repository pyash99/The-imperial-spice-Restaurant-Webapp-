# The Imperial Spice - Restaurant Webapp

## Project Overview

The Imperial Spice is a full-stack restaurant web application that allows customers to browse a menu, add items to a shopping cart, and place orders for delivery or pickup. The application features user authentication, order history tracking, and a modern responsive design with a gold and dark color theme. This project demonstrates core web development concepts including server-side rendering, database management, user authentication, and secure payment processing.

The restaurant can display their menu items with images and prices, customers can create accounts and manage their profiles, and the system maintains a complete order history for each user. The application uses a simple Cash on Delivery payment model, which was implemented after the original Stripe payment integration encountered technical difficulties. This approach is particularly suitable for restaurants in regions where online payment adoption is still growing, as it provides customers with flexibility and builds trust through face-to-face payment at delivery.

## Technology Stack

This section explains each technology used in the project in simple terms, helping you understand why each tool was chosen and how they work together to create the web application.

### Backend Technologies

**Node.js** serves as the runtime environment for the server-side code. Think of Node.js as the engine that executes JavaScript outside of a web browser, allowing developers to use a single programming language (JavaScript) for both the frontend and backend of an application. In this project, Node.js runs the Express server that handles incoming requests from users, processes them, and sends back responses. Node.js is particularly well-suited for web applications because it can handle multiple simultaneous connections efficiently, making it responsive even when many users are ordering food at the same time.

**Express.js** is a web framework built on top of Node.js that simplifies the process of building web servers and APIs. Rather than writing complex low-level code to handle HTTP requests, Express provides a clean interface for defining routes (URL patterns), handling different HTTP methods (GET, POST, PUT, DELETE), and managing middleware (functions that process requests before they reach their final destination). In this project, Express handles all the server logic, from serving HTML pages to processing user registration and order placement.

**MongoDB** is a NoSQL (Not Only SQL) database that stores data in flexible, JSON-like documents rather than the rigid tables used by traditional relational databases. Imagine a document store as a filing cabinet where each file can have a different structure - unlike a spreadsheet where every row must have the same columns. MongoDB is particularly useful for web applications because it handles unstructured data well and scales easily. In this project, MongoDB stores user accounts, menu items, shopping carts, and order history, all connected through unique identifier codes.

**Mongoose** is a library that acts as a bridge between the Node.js application and MongoDB. It provides a schema-based approach to data modeling, meaning you define the structure of your data (like a blueprint) and Mongoose handles the database connections, validation, and complex queries. Using Mongoose makes it easier to work with MongoDB because you can write JavaScript code that looks like you're working with regular objects, rather than raw database queries.

### Authentication and Session Management

**Passport.js** is authentication middleware for Node.js that handles user login and registration. It provides a flexible system for authenticating users through various methods (local username/password, social logins, etc.) without complicating your application code. Passport uses the concept of "strategies" - each strategy defines how to authenticate users with a particular method. In this project, we use the "local" strategy, which authenticates users against a username and password stored in our MongoDB database.

**bcryptjs** is a library for hashing passwords securely. When a user creates an account or changes their password, bcryptjs converts the plain text password into a scrambled hash that cannot be reversed to find the original password. This is crucial for security - even if someone gains access to the database, they cannot see user passwords. When a user logs in, bcryptjs hashes the entered password and compares it to the stored hash to verify identity.

**express-session** creates and manages user sessions, which are essential for maintaining login state across different page requests. When a user logs in, the server creates a session and stores a session ID in a cookie on the user's browser. On subsequent requests, the browser sends this cookie, allowing the server to recognize the logged-in user. This is what keeps you logged in as you navigate from the menu to cart to checkout.

**connect-mongo** stores session data in MongoDB rather than in server memory. This is important because server memory is cleared when the application restarts, but database-stored sessions persist. It also allows multiple server instances (if you scale up) to share session data.

### Frontend Technologies

**EJS (Embedded JavaScript)** is a templating language that allows you to embed JavaScript code directly into HTML. Unlike a Single Page Application where the browser downloads data and builds the page, EJS renders pages on the server and sends complete HTML to the browser. This approach (server-side rendering) is simpler to implement and good for SEO. When you visit the menu page, EJS loops through the database of dishes and creates HTML for each one, inserting the name, price, and image URL dynamically.

**HTML/CSS/JavaScript** form the standard web trio. HTML provides the structure (headings, paragraphs, buttons), CSS handles the appearance (colors, fonts, layouts), and JavaScript adds interactivity (button clicks, form validation, cart updates). The project uses a custom stylesheet with CSS variables to maintain consistent gold and dark theming throughout the application.

### Additional Dependencies

**dotenv** loads environment variables from a .env file into your application. This keeps sensitive information (like database passwords and API keys) out of your source code, which is important for security and when working in teams. Instead of hardcoding secrets, you reference them as variables that are loaded from the environment.

**express-validator** provides middleware for validating and sanitizing user input. When a user submits a registration form, express-validator checks that the email looks like a real email, the password meets minimum requirements, and removes any potentially dangerous characters that could be used in attacks.

**express-rate-limit** protects the application from brute-force attacks and abuse by limiting how many requests a single IP address can make in a given time period. For example, it can prevent someone from trying thousands of password combinations in a minute.

**connect-flash** provides temporary notification messages (like "Registration successful!" or "Invalid password") that display once and then disappear. These messages are stored in the session and cleared after being displayed to the user.

## Features

The Imperial Spice restaurant webapp includes a comprehensive set of features designed to provide a complete online ordering experience. Each feature addresses a specific user need and demonstrates important web development concepts.

**User Authentication** allows customers to create accounts, log in securely, and manage their profiles. The registration process collects name, email, phone number, and password, with server-side validation ensuring data quality. Passwords are hashed using bcryptjs before storage, protecting user credentials even if the database is compromised. Once logged in, users can access their profile page, view order history, and manage their account information.

**Menu Display** presents the restaurant's dishes in an attractive, grid-based layout. Each menu item shows a photograph, name, description, price, and an "Add to Cart" button. The menu data is stored in MongoDB and dynamically loaded when users visit the page. This separation of data from presentation means the restaurant can easily update prices, add new dishes, or remove items without changing the HTML code.

**Shopping Cart** enables users to select multiple items and specify quantities. The cart persists across sessions, so users can add items, leave the site, and return later to complete their purchase. The cart displays running totals, allows quantity adjustments, and shows an itemized list before checkout. Users must be logged in to add items to their cart, which prevents anonymous orders and ensures order tracking.

**Cash on Delivery Checkout** simplifies the payment process by collecting order details and contact information without requiring online payment. When the order is delivered, the customer pays the delivery person directly. This approach reduces payment processing complexity, avoids transaction fees, and may increase order conversion rates in regions where cash transactions remain common.

**Order History** maintains a complete record of each user's past orders, accessible from their profile page. Each order record includes the date, time, items ordered, quantities, prices, total amount, delivery address, phone number, and order status. This feature helps users track their ordering patterns and provides reference information if any issues arise with past orders.

**Responsive Design** ensures the website works well on both desktop computers and mobile phones. The CSS uses flexible layouts, media queries, and relative units (percentages, viewport widths) to adapt the presentation to different screen sizes. The gold and dark color scheme creates an elegant, upscale appearance appropriate for a restaurant brand.

## Project Structure

Understanding the project folder structure helps you navigate the codebase and locate specific functionality when making changes or fixing bugs.

```
webProject/
├── app.js                     # Main server file - entry point of the application
├── package.json              # Lists all dependencies and project metadata
├── .env                      # Stores sensitive configuration (passwords, API keys)
├── .gitignore                # Specifies files to exclude from version control
├── seeder.js                 # Populates database with initial menu items
├── models/                   # Database schema definitions
│   ├── user.js               # User account schema
│   ├── product.js            # Menu item schema
│   ├── cart.js               # Shopping cart schema
│   ├── order.js              # Order history schema
│   └── passport.js            # Passport authentication configuration
├── routes/                   # Route handlers - defines URL endpoints
│   ├── menu.js               # Menu, cart, checkout, and order routes
│   ├── users.js              # User registration and login routes
│   └── booking.js            # Table reservation routes
├── views/                    # EJS templates (HTML with embedded JavaScript)
│   ├── index.ejs             # Homepage
│   ├── menu.ejs              # Menu display page
│   ├── cart.ejs              # Shopping cart page
│   ├── checkout.ejs          # Checkout form page
│   ├── profile.ejs           # User profile and order history
│   ├── login.ejs             # User login page
│   ├── register.ejs          # User registration page
│   ├── booking.ejs           # Table reservation page
│   ├── 404.ejs               # Page not found error
│   ├── 500.ejs               # Server error page
│   └── partials/             # Reusable template components
│       ├── header.ejs        # Main navigation header
│       ├── header1.ejs       # Header for auth pages
│       ├── header2.ejs       # Header for homepage
│       ├── footer.ejs       # Main footer
│       └── footer1.ejs       # Footer for auth pages
└── public/                   # Static files served directly to browsers
    ├── stylesheets/
    │   └── main.css         # Main stylesheet with gold/dark theme
    └── javascript/
        └── checkout.js      # Client-side checkout functionality
```

The **models** folder contains Mongoose schemas that define the structure of data in MongoDB. Each file corresponds to a collection (like a table in SQL) and specifies what fields each document should have, along with validation rules and data types.

The **routes** folder contains route handlers - functions that execute when a user visits a particular URL. Each route file focuses on a specific feature area. For example, menu.js handles all operations related to viewing the menu, adding items to cart, and placing orders.

The **views** folder contains EJS templates that define what pages look like. The partials subfolder contains components (headers, footers) that are included in multiple pages, avoiding code duplication.

The **public** folder holds static assets - files that don't change and are served directly to browsers without processing. This includes CSS stylesheets, JavaScript files, and images.

## Database Schema

This section explains each database collection (model) and its fields, helping you understand how data is organized and related throughout the application.

### User Model

The User model stores customer account information and serves as the foundation for authentication and order tracking.

```javascript
{
    name: String,           // Full name of the user
    email: String,          // Unique email address for login
    username: String,       // Username for login (may differ from email)
    password: String,       // Hashed password (never stored in plain text)
    phone: String,          // Contact phone number for orders
    date: Date              // Account creation timestamp
}
```

When a user registers, their information is validated and their password is hashed using bcryptjs before being stored in MongoDB. The email field is marked as unique, preventing duplicate accounts with the same email address.

### Product Model

The Product model represents menu items available for order.

```javascript
{
    name: String,           // Dish name (e.g., "Butter Chicken")
    image: String,          // URL to dish photograph
    description: String,   // Brief description of the dish
    price: Number,         // Price in local currency
    category: String        // Category (e.g., "veg", "non-veg")
}
```

The seeder.js file pre-populates this collection with 15 menu items when the database is first set up. The application queries this collection to display the menu and retrieves individual items when users add them to their cart.

### Cart Model

The Cart model stores items that users have added to their shopping cart.

```javascript
{
    user: ObjectId,         // Reference to User model (who owns this cart)
    products: [{
        product: ObjectId, // Reference to Product model
        name: String,      // Snapshot of product name at time added
        price: Number,     // Snapshot of price at time added
        image: String,     // Snapshot of image URL
        quantity: Number   // Quantity of this item
    }],
    totalAmount: Number     // Calculated total for all items
}
```

Storing product information as a snapshot (rather than just a reference) is important because menu items can change over time (price updates, items removed). If we only stored a reference, past cart items would break when menu items change.

### Order Model

The Order model records completed purchases for order history tracking.

```javascript
{
    user: ObjectId,              // Reference to User model
    products: [{                // Array of ordered items
        product: ObjectId,      // Reference to Product
        name: String,           // Product name snapshot
        price: Number,          // Price at time of order
        quantity: Number        // Quantity ordered
    }],
    phone: String,              // Contact phone for delivery
    address: String,            // Delivery address
    totalAmount: Number,        // Total order amount
    paymentMethod: String,      // "Cash on Delivery"
    date: {                     // Order timestamp
        type: Date,
        default: Date.now
    },
    status: String              // Order status (e.g., "Pending", "Delivered")
}
```

The Order model captures a complete snapshot of the transaction at the time of purchase, including product details, quantities, prices, and customer information. This ensures order history remains accurate regardless of future menu changes.

## API Routes

Routes define how the server responds to different URLs and HTTP methods. Understanding routes helps you know what functionality exists and how to extend it.

### User Routes (routes/users.js)

| Route | Method | Description |
|-------|--------|-------------|
| /register | GET | Display registration form |
| /register | POST | Process new user registration |
| /login | GET | Display login form |
| /login | POST | Authenticate user credentials |
| /logout | GET | End user session |

The POST /register route validates input using express-validator, checks for existing accounts, hashes the password with bcryptjs, creates a new User document in MongoDB, and redirects to the login page. The POST /login route finds the user by username, compares the hashed password, establishes a session if successful, and redirects to the menu.

### Menu Routes (routes/menu.js)

| Route | Method | Description |
|-------|--------|-------------|
| / | GET | Homepage with welcome message |
| /menu | GET | Display menu items |
| /menu/add/:id | POST | Add item to shopping cart |
| /cart | GET | Display shopping cart |
| /cart/update | POST | Update item quantities |
| /cart/remove/:id | POST | Remove item from cart |
| /checkout | GET | Display checkout form |
| /checkout | POST | Process order placement |
| /profile | GET | Display user profile and orders |

The /menu route queries the Product collection and renders the menu.ejs template with the results. The /menu/add/:id route requires authentication (checking req.isAuthenticated()) and adds the specified product to the user's cart, creating a new cart if one doesn't exist. The /checkout route processes the final order by creating an Order document and clearing the user's cart.

### Booking Routes (routes/booking.js)

| Route | Method | Description |
|-------|--------|-------------|
| /booking | GET | Display reservation form |
| /booking | POST | Submit table reservation |

The booking feature is currently a form submission without backend storage. Future enhancement would involve creating a Booking model to store reservations and potentially integrating with a table management system.

## Security Features

Security is a critical aspect of any web application that handles user data and authentication. This project implements several security measures that protect both users and the application.

**Password Hashing** ensures that even if the database is compromised, attackers cannot recover user passwords. bcryptjs uses a technique called "salting" (adding random data before hashing) and is designed to be computationally expensive, making brute-force attacks impractical. When users create accounts, their passwords are transformed into irreversible hashes before storage.

**Environment Variables** keep sensitive configuration separate from source code. The .env file contains database credentials, session secrets, and other secrets that should never be committed to version control. The dotenv library loads these values into process.env when the application starts, making them available throughout the code without hardcoding.

**Input Validation** using express-validator sanitizes all user input before processing. This prevents attacks like SQL injection (in MongoDB, this would be NoSQL injection) and Cross-Site Scripting (XSS). The validator checks that emails are properly formatted, required fields are present, and potentially dangerous characters are removed.

**Rate Limiting** with express-rate-limit prevents abuse by limiting requests from individual IP addresses. The default configuration allows reasonable usage (like normal browsing and ordering) while blocking automated attacks that try thousands of requests per minute. This protects against brute-force password guessing and denial-of-service attacks.

**Session Security** involves several practices. The session secret (used to sign session cookies) is stored in environment variables rather than hardcoded. Session cookies have httpOnly enabled, preventing client-side JavaScript from accessing them (which protects against XSS session theft). Sessions are stored in MongoDB via connect-mongo, allowing them to persist across server restarts.

**Authentication Middleware** ensures that sensitive operations require a logged-in user. The isAuthenticated() function (provided by Passport.js) checks for a valid session on every request to protected routes like /cart, /checkout, and /profile. Unauthenticated users are redirected to the login page with a message explaining they must log in first.

## Setup and Installation

This section provides step-by-step instructions for setting up the development environment and running the application locally.

### Prerequisites

Before installing, ensure you have the following software installed on your computer:

**Node.js** is required to run the server. You can download the LTS (Long Term Support) version from nodejs.org. To verify installation, open a terminal and type "node -v" - you should see a version number like v18.x.x or higher.

**MongoDB** is required for the database. You can install MongoDB Community Server from mongodb.com, or use MongoDB Atlas (cloud-based) for easier setup. For local development, installing MongoDB Community Server and running the mongod service is sufficient.

### Installation Steps

**Clone or navigate to the project directory** and open a terminal in the webProject folder.

**Install dependencies** by running the following command:

```
npm install
```

This reads the package.json file and installs all listed dependencies (Express, Mongoose, Passport, etc.) into a node_modules folder. This may take a minute or two depending on your internet connection.

**Configure environment variables** by creating a .env file in the webProject directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/imperialspice
SESSION_SECRET=your_secret_key_here
```

Replace "your_secret_key_here" with a long random string. In production, this should be a complex password or API key. The MONGO_URI specifies the database connection string - change this if using MongoDB Atlas or a different local port.

**Start MongoDB** if running locally. On Windows, start the MongoDB service through Services or run "mongod" in a separate terminal. On macOS/Linux, you might use "brew services start mongodb-community" or run "mongod" directly.

### Running the Application

**Start the server** by running:

```
npm start
```

or for development with auto-restart on file changes (if nodemon is installed):

```
npx nodemon app.js
```

You should see console output indicating the server is running, typically "Server started on port 3000" or similar.

**Access the application** by opening a web browser and navigating to:

```
http://localhost:3000
```

The homepage should load, showing the restaurant welcome page with navigation to menu, login, and registration pages.

**Seed the database** (first time only) by visiting:

```
http://localhost:3000/menu
```

This route automatically calls the seeder function if the database is empty, populating the Product collection with 15 menu items. Subsequent visits will not re-seed unless the database is cleared.

## How to Use

Once the application is running, here's the typical user flow:

**Creating an Account** - Click "Register" in the navigation, fill in your name, username, email, phone, and password, then submit. You'll be redirected to the login page with a success message.

**Logging In** - Enter your username and password on the login page. Upon successful authentication, you'll be redirected to the menu page.

**Browsing the Menu** - The menu page displays all available dishes in a grid layout. Each item shows a photo, name, description, and price. You can add items to your cart by clicking the "Add to Cart" button.

**Managing Cart** - Click "Cart" in the navigation to view your selected items. You can increase or decrease quantities using the +/- buttons, remove items entirely, or proceed to checkout when ready.

**Placing an Order** - The checkout form collects your phone number and delivery address. Select "Cash on Delivery" as the payment method and submit. You'll receive confirmation and can view your order in your profile.

**Viewing Order History** - Click "Profile" in the navigation to see your account details and past orders. Each order shows the date, items, total amount, delivery address, and status.

## Future Improvements

While the current implementation provides a functional ordering system, several enhancements could expand its capabilities:

**Online Payment Integration** would allow customers to pay online using credit cards, debit cards, or digital wallets. This would require resolving the Stripe integration issues or exploring alternatives like Paytm, Razorpay, or other region-specific payment gateways.

**Table Reservation System** could allow customers to book tables in advance. This would involve creating a Booking model to store reservations, implementing availability checking logic, and potentially sending confirmation emails or SMS.

**Email Notifications** could send order confirmations, status updates, and promotional offers to customers. Integration with services like SendGrid or Nodemailer would enable automated email communications.

**Admin Dashboard** would give restaurant owners an interface to manage menu items (add, edit, remove), view and process orders, manage delivery status, and view sales analytics.

**Menu Categories and Filtering** could improve the browsing experience by organizing dishes into categories (appetizers, main course, desserts, beverages) and allowing customers to filter by vegetarian/non-veg, spice level, or dietary restrictions.

**Delivery Tracking** could show customers the status of their order in real-time, from order confirmation through preparation to out-for-delivery and delivered.

**Mobile Application** could extend the reach to customers who prefer native mobile apps over browser-based access.

## Troubleshooting Common Issues

**MongoDB Connection Errors** - If you see connection refused errors, ensure MongoDB is running (check the mongod process). Verify the MONGO_URI in your .env file matches your MongoDB configuration.

**Session Not Working** - If you cannot stay logged in, check that SESSION_SECRET is set in .env and that cookies are not being blocked by your browser.

**Images Not Loading** - Verify that image files exist in the public/stylesheets/images folder and that the paths in the Product model match the actual file locations.

**Port Already in Use** - If port 3000 is occupied, either stop the other application or change the port in app.js to a different number (like 3001).

**npm Install Fails** - Ensure Node.js is installed correctly. Try deleting node_modules and package-lock.json, then run npm install again. For Windows users, consider using Git Bash or Windows Subsystem for Linux for better compatibility.
