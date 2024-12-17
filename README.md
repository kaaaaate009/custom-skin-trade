# Custom Game Skins Trading Platform

A dynamic Custom Game Skins Trading Platform built with Node.js backend and Express.js framework. The project enables users to establish accounts, explore game weapon skins, and trade with other registered users. It employs Mongoose for schema-based data modeling with type casting, using MongoDB as the database. Additionally, the platform features integrated error handling, APIs for resolving potential database operations, database storage encryption, and robust session management for enhanced security.

## Features

- User Registration and Authentication
- Explore Game Weapon Skins
- Trade with Registered Users
- Error Handling and APIs for Database Operations
- Database Storage Encryption
- Robust Session Management

## Technologies Used

- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (Data Modeling)
- Docker & Docker Compose (Containerization)

## Installation and Setup

The application and database have been containerized for ease of deployment. Follow the steps below to set up and run the application:

#### Prerequisites
Ensure you have Docker and Docker Compose installed on your system.

#### Steps to Run the Application

##### 1. Create a Docker Network:

   `docker network create skin_app_net`

##### 2.  Start Containers:

   Use the following command to start both the application and database containers:

   `docker-compose -f docker-compose.db.yml -f ../application/docker-compose.app.yaml up --build -d`

   The command builds and starts the containers in detached mode.
   Temporary data will be loaded into the database for initial testing.

##### 3. Access the Application:

   Once the containers are running, the application will be accessible at: `http://localhost:3000`

##### 4. Additional Details:

   Refer to the respective infrastructure folders (db and application) for more detailed configurations.

## Usage

1. Register an account on the platform.
2. Explore available game weapon skins.
3. Initiate trades with other registered users.
4. Manage your trades, inventory, and profile.

## Contribution

Contributions to this project are welcome! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-new-feature`
5. Open a pull request.

## License

This project is licensed under the [Apache-2.0 License](LICENSE).

## Contact

For any inquiries or suggestions, feel free to reach out to [SwarajDhondge](mailto:swarajdhondge@gmail.com).

Project Link: [https://github.com/swarajdhondge/custom-skin-trade](https://github.com/kaaaaate009/custom-skin-trade)

