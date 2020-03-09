## STEP 1: Installation

### Method 1: Using Docker.

1. Install Docker and Docker compose on your machine
2. Get the code from [github](http://github.com)
3. Go to the project folder and run the command on command prompt


    ```
      docker-compose up --build
    ```

4. go to browser and hit http://localhost:7484/browser
5. It will ask for username and password, put the default values as neo4j/neo4j
6. change the password as "admin", we used that in our configuration

### Method 2:

1. Install node and neo4j on you machine. Check the running of neo4j on your machine by the following command


    ```
    service neo4j status
    ```

2. Get the code from [github](http://github.com)
3. Go to the project folder and run the command on command prompt


    ```
      npm i
      npm run dev
    ```

4. go to browser and hit http://localhost:7484/browser
5. It will ask for username and password, put the default values as neo4j/neo4j
6. change the password as "admin", we used that in our configuration

   #

## STEP 2: Testing with Rest Client like postman

- GET - localhost:7000/api/users/
- POST - localhost:7000/api/users/
  ```
  JSON Request :
  {
    "id":1,
    "name": "User1",
    "email: "User1@email.com"
  }
  ```
- GET - localhost:7000/api/users/1
- PATCH - localhost:7000/api/users/2
  ```
  JSON Request :
  {
    "name": "User2 EDIT",
    "email": "User2@email.com"
  }
  ```
- DELETE - localhost:7000/api/users/2

- POST - localhost:7000/api/friends/add
  ```
  JSON Request:
  {
    "source":1,
    "destination":2
  }
  ```
- GET - localhost:7000/api/friends/list/2
- POST - localhost:7000/api/friends/delete
  ```
  JSON Request:
  {
    "source":1,
    "destination":2
  }
  ```
