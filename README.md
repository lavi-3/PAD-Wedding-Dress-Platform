
# Wedding Dress Platform: Microservices-Based Architecture

## Overview

The Wedding Dress Platform is a distributed system built using a microservices architecture, aiming to streamline the management of wedding dress designers and client interactions. This document outlines the architecture, technology stack, data management, and deployment instructions for the platform.

## Application Suitability

The platform's microservices architecture is ideal for modular development, allowing independent scaling of different components. This architecture provides the following benefits:
- **Scalability**: The Wedding Dress Platform is well-suited for a microservices architecture due to the diverse range of functionalities it offers, each benefiting from modular development. By decoupling different parts of the application, such as client management and dress cataloging, the platform can scale specific services independently. This independence ensures that if the`` Dress Management Microservice ``experiences high traffic, it can be scaled without impacting the ``Client Management Microservice``, leading to optimized resource allocation.
- **Fault Tolerance**: Microservices also enhance fault tolerance. If one service fails, the rest of the system remains operational, increasing the platform’s reliability. This is essential for maintaining uninterrupted user experiences, as clients can still access other parts of the system while an individual service is being fixed or updated.
- **Security** is another significant advantage. Each microservice can have tailored security protocols, enabling granular control over data access and user authentication. This approach protects sensitive client and designer information, especially when handling data related to personal details and financial transactions.

	The platform's adoption of real-time communication through WebSockets further justifies the use of microservices. The **Lobby Service** for real-time interactions can be managed and scaled independently, ensuring low-latency responses critical for engaging user experiences.

	Lastly, microservices facilitate continuous deployment and development, allowing updates to be applied to specific services without affecting the whole system. This results in shorter development cycles and faster delivery of new features or fixes, providing significant business value and adaptability in a competitive market.

## Service Boundary

### Diagram
![Lab2ch1](https://github.com/user-attachments/assets/61809988-e3f3-422d-ba93-756c40bece64)


### Components

- **API Gateway (Java)**: Serves as the central entry point for incoming client requests, distributing them to the appropriate microservices via REST and ensuring efficient request handling with load balancing capabilities.
- **Service Discovery (Java)**: Oversees the registration and lookup of microservices, facilitating seamless communication and coordination between services through gRPC.
- **Client Management Microservice (Node.js)**: Manages client-related functionalities, including user registration, authentication, and profile handling. Connects to a dedicated **MongoDB Client Database** for data persistence.
- **Dress Management Microservice (Node.js)**: Responsible for operations related to wedding dresses, such as creation, updates, and retrieval of dress information. Utilizes a **MongoDB Dresses Database** for storing and accessing dress data.
- **Redis Cache**: Deployed in a Docker container, it provides a caching layer for frequently accessed data to boost performance and reduce load on the main database.
- **ELK Stack (Elasticsearch, Logstash, Kibana)**: Collects, processes, and visualizes logs from various services to enable monitoring, analysis, and troubleshooting of the platform.
- **ETL Service**: Extracts, transforms, and loads data from the service databases into the **Data Warehouse (MongoDB)** for aggregated analysis and reporting purposes.
- **Data Warehouse (MongoDB)**: Acts as a centralized repository for data collected and processed by the ETL service, facilitating business intelligence and advanced data analysis.

Your **Technology Stack** section is well-structured and provides a clear overview of the technologies used. Here are a few enhancements and additional details you might want to consider adding:


Here's the updated **Technology Stack** section with added lines about Eureka and REST:

## Technology Stack

- **Programming Languages**: Java, JavaScript (Node.js)
- **Frameworks**:
  - **Java**: Spring Boot for the API Gateway and Service Discovery, ensuring efficient routing, load balancing, and service registration.
  - **Node.js**: Express.js for the Dress Management Microservice and Client Management Microservice, providing a lightweight and fast server-side environment.
- **Databases**:
  - **MongoDB**: NoSQL databases used for storing client, dress, and other relevant data, offering flexibility and scalability.
- **Caching**:
  - **Redis**: Utilized for caching frequently accessed data to improve response time and reduce database load, with consistent hashing for load distribution.
- **Monitoring & Logging**:
  - **ELK Stack (Elasticsearch, Logstash, Kibana)**: Integrated for centralized log collection, real-time monitoring, and data visualization to aid in system debugging and performance tracking.
- **Data Processing**:
  - **ETL Service**: Responsible for extracting, transforming, and loading data into a **Data Warehouse** for advanced analytics and reporting.
- **Communication**:
  - **HTTP**: Used for client-to-service communication, ensuring compatibility with web clients.
  - **REST (Representational State Transfer)**: Employed as an architectural style for defining lightweight, stateless interactions between client and server.
  - **WebSockets**: Enables real-time bidirectional communication for interactive features like live updates and chat.
  - **gRPC**: Used for efficient inter-service communication, providing high performance and low latency.
- **Service Discovery**:
  - **Eureka**: Utilized for dynamic service registration and discovery, allowing microservices to find and communicate with each other without manual configuration.
- **Containerization**:
  - **Docker**: Ensures consistent environments across development, testing, and production with isolated containers for each service.
  - **Docker Compose**: Simplifies multi-container setup and orchestration for local development and deployment.

## Data Management

### Database Design
Each microservice uses its own database for maintaining data encapsulation and service autonomy.

#### Dress Management Microservice
- **Database**: MongoDB
- **Entry Example**:
  ```json
  {
    "id": 1,
    "designerId": 2,
    "name": "Romantic Lace Gown",
    "description": "Elegant lace gown with intricate details.",
    "price": 2500,
    "image": "dress.jpg"
  }
  ```

### Data Access and APIs


-   **Create Fabric**:
    
    -   **Endpoint**: `POST http://localhost:3000/fabric/create`
    -   **Request Body**:
        
     ```   json
        
            
        {
          "name": "Fabric nr.1",
          "location": "France",
          "description": "Best firm"```
This endpoint is used to create a new fabric entry in the system, specifying its name, location, and description.
-   **Create Dress Order**:
    
    -   **Endpoint**: `POST http://localhost:3001/lover/order`
    -   **Request Body**:
        
     ```   json
         
        `{
          "dress": "Elegant dress",
          "material": "Cotton",
          "price": 100,
          "date": "04/10/2024"
        }
      ```
        
This endpoint is used to place a dress order, including details such as the dress type, material, price, and order date.
-   **Create User**:
    
    -   **Endpoint**: `POST http://localhost:3001/lover/create`
    -   **Request Body**:
        
     ```   json
      
        `{
          "name": "NewUser",
          "location": "Moldova",
          "orderId": "67002cfe84f44e6e4d4c58d1"
        }
       ```
        
This endpoint registers a new user with their name, location, and associated order ID.

3. **Status Endpoint**:
   - **Endpoint**: `GET /status`
   - **Response**:
     ```json
     {
       "status": "OK",
       "uptime": "5000s",
       "message": "Service is running",
       "timestamp": "2024-11-04T08:45:00Z"
     }
     ```

## Real-Time Communication and WebSocket Integration
WebSockets are a communication protocol that allows persistent, two-way interaction between the client and server, enabling real-time data exchange. In the Wedding Dress Platform, the **Dress Management Microservice** incorporates a **lobby mechanism** to leverage this protocol for seamless, real-time communication. A lobby system is a feature that lets users join or leave a shared virtual space where they can interact live. This setup is particularly valuable for collaborative or interactive sessions, such as virtual dress consultations or group discussions. By enabling clients to connect to a lobby, the platform fosters user engagement and provides immediate feedback and interaction capabilities. This real-time communication enhances the user experience, ensuring updates and messages are transmitted instantly without delays. The integration of WebSockets and a lobby mechanism supports a dynamic and interactive platform environment, catering to user expectations for responsiveness and continuous connectivity.

### WebSocket Endpoints:
- **Join Lobby**:
  - **Event**: `joinLobby`
  - **Request Payload**:
    ```json
    {
      "lobbyName": "Spring2025Collection",
      "username": "jane_doe"
    }
    ```

- **Send Message**:
  - **Event**: `message`
  - **Request Payload**:
    ```json
    {
      "message": "This dress is perfect!",
      "username": "jane_doe"
    }
    ```

- **Leave Lobby**:
  - **Event**: `leaveLobby`
  - **Request Payload**:
    ```json
    {
      "username": "jane_doe"
    }
    ```

## Deployment Instructions

### Prerequisites:
Ensure Docker and Docker Compose are installed on your system.

### Environment Configuration:
Create a `.env` file in the root directory with the following:
```plaintext
DB_URL=mongodb://localhost:27017/MyDatabase
REDIS_URL=redis://localhost:6379
EUREKA_SERVER=http://localhost:8008/eureka/apps/
```

### Run the Platform:

#### Deployment Instructions

To set up and run the Wedding Dress Platform, follow these steps:

1. **Run Redis**:
   ```bash
   docker run --name redis -d redis
   ```

2. **Run MongoDB Containers**:
   - **Lover Database**:
     ```bash
     docker run --name lover -d -p 27017:27017 -v mongodata:/data/db_lover mongo
     ```
   - **Fabric Database**:
     ```bash
     docker run --name fabric -d -p 27018:27017 -v mongodata:/data/db_fabric mongo
     ```

3. **Run Redis with Port Mapping**:
   ```bash
   docker run --name redis-container -d -p 6379:6379 redis:latest
   ```

4. **Run the Platform**:
   ```bash
   docker-compose up --build
   ```

5. **Verify Deployment**:
   Check the `/status` endpoint for each microservice to ensure they are running properly:
   ```bash
   curl http://localhost:3000/status
   curl http://localhost:3001/status
   ```

6. **Stop the Platform**:
   ```bash
   docker-compose down
   ```

These steps will set up and manage the microservices, databases, and caching needed for the platform's operations.

## Logging and Monitoring

The platform uses a centralized logging system to monitor service health and performance. For advanced log analysis, integrating the ELK Stack (Elasticsearch, Logstash, Kibana).

