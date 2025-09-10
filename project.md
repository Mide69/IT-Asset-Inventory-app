1 - Create a simple REST API Webserver
Learning Outcomes
Learn about the best practices for REST APIs.

Learn about the Twelve-Factor App methodology.

Problem Statement
Create a student CRUD REST API using any programming language and web framework of your choice. You can choose to use any of the following:

Golang and Gin

Java and Spring Boot

Python and Flask

Node.js etc.

Functional Requirement
Using the API we should be able to perform the following operations.

Add a new student.

Get all students.

Get a student with an ID.

Update existing student information.

Delete a student record.

Expectations
The following expectations should be met to complete this milestone.

Create a public repository on GitHub.

The repository should contain the following

README.md file explaining the purpose of the repo, along with local setup instructions.

Explicitly maintaining dependencies in a file ex (pom.xml, build.gradle, go.mod, requirements.txt, etc).

Makefile to build and run the REST API locally.

Ability to run DB schema migrations to create the student table.

Config (such as database URL) should not be hard-coded in the code and should be passed through environment variables.

Postman collection for the APIs.

API expectations

Support API versioning (e.g., api/v1/<resource>).

Using proper HTTP verbs for different operations.

API should emit meaningful logs with appropriate log levels.

API should have a /healthcheck endpoint.

Unit tests for different endpoints.