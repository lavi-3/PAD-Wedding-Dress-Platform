# PAD-Wedding-Dress-Platform

## Wedding Venue Management System (Microservices with Java & NodeJS)

This document outlines a microservices architecture for a wedding venue management system. 

## Why Microservices?

A microservices approach offers several benefits:

* **Modular Development:** Independent development and maintenance of client management and dress management services lead to better organization and faster development cycles.
* **Scalability:** Services can be scaled independently based on usage. Client management might experience higher traffic than dress management, allowing for optimized resource allocation.
* **Fault Isolation:** Issues in one service (e.g., client management) won't affect the other (dress management), improving system reliability.

## Technology Stack

* **Client Management Microservice (Java):**
    * Programming Language: Java
    * Framework: Spring Boot
    * Database: MongoDB
    * Communication: REST APIs
* **Dress Management Microservice (NodeJS):**
    * Programming Language: JavaScript (NodeJS)
    * Framework: Express.js
    * Database: MongoDB
    * Communication: REST APIs

## Service Boundaries

![Microservice Diagram](https://github.com/user-attachments/assets/62d90ddf-fd85-4590-8f83-094289e67b9d)


1. **Client Management Microservice:** Manages client registrations, logins, venue searches, bookings, and communication with venues (sending inquiries).
2. **Dress Management Microservice:** Manages dress designer registrations, logins, dress uploads (including pictures, descriptions, prices), and dress updates/deletions.

## Data Management (MongoDB)

* **Client Entity (Client Management Microservice):**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "weddingDate": "2025-10-25",
  "guestCount": 100
}
```

* **Dress Entity (Dress Management Microservice):**

```json
{
  "id": 1,
  "designerId": 2,
  "name": "Romantic Lace Gown",
  "description": "Elegant lace gown with...",
  "price": 2500,
  "image": "dress.jpg"
}
```

## API Endpoints (Examples)

**Client Management Microservice:**

* `POST /api/clients`: Register a new client.
* `POST /api/clients/login`: Login a client.
* `GET /api/venues`: Search for venues based on criteria.
* `POST /api/venues/{id}/inquire`: Send an inquiry to a venue.

**Dress Management Microservice:**

* `POST /api/designers`: Register a new dress designer.
* `POST /api/designers/login`: Login a dress designer.
* `POST /api/dresses`: Upload a new dress.
* `GET /api/dresses`: Get a list of all dresses.
* `GET /api/dresses/{id}`: Get details of a specific dress.
* `PUT /api/dresses/{id}`: Update a dress.

## Deployment

* Regarding containerization, I have opted for Docker. Docker enables the packaging and execution of software within a loosely isolated environment referred to as a container. Deployment and scalability are essential for the implementation of microservices. I will choose Docker Compose for orchestration and scaling.

