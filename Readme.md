## STEP 1: Installation

### Method 1: Using Docker.

1. Install Docker and Docker compose on your machine
2. Get the code from [github](https://github.com/gulmoharnnt/ExpressNeo4jCRUD)
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

2. Get the code from [github](https://github.com/gulmoharnnt/ExpressNeo4jCRUD)
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

1. To get the User List
  - GET - localhost:7000/api/users/

2. To add new User
  - POST - localhost:7000/api/users/
  ```
  JSON Request :
  {
    "id":1,
    "name": "User1",
    "email": "User1@email.com"
  }
  ```
3. To get particular user details
  - GET - localhost:7000/api/users/1 

4. To Update the user details 
   - PATCH - localhost:7000/api/users/2
  ```
  JSON Request :
  {
    "name": "User2 EDIT",
    "email": "User2@email.com"
  }
  ```
5. To delete the user
  - DELETE - localhost:7000/api/users/2
  
6. To add user as friend
  - POST - localhost:7000/api/friends/add
  ```
  JSON Request:
  {
    "source":1,
    "destination":2
  }
  ```

7. To get the friend list
  - GET - localhost:7000/api/friends/list/2

8. To delete a friend from a list
  - POST - localhost:7000/api/friends/delete
  ```
  JSON Request:
  {
    "source":1,
    "destination":2
  }
  ```

