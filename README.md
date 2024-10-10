Assignment Portal

Install Dependencies Before running the application, you need to install
the necessary packages. Open your terminal and run - npm install

Start the Server After installing the packages, start the server by
executing the following command in the terminal (it executes
server.js) - npm run start

Server Status Once the server is running, it will start listening on the
specified port (defined in your .env file). The server will also connect
to the MongoDB database specified in the .env file.

dotenv file should contains

MONGODB_URI= your mongodb url DATABASE_NAME= database name PORT=3000
(your own port) LINKEDIN_PURL= linkedin callback url LINKEDIN_CLIENT_ID
= linkedin client id LINKEDIN_CLIENT_SECRET = linkedin secret id
JWT_SECRET = jwt secrect key JWT_COOKIE_EXPIRES_IN= expiration time (eg:
30)

Api end points

1\) http://localhost:3000/User/register 2)
http://localhost:3000/User/login 3) http://localhost:3000/Admin/register
4) http://localhost:3000/Admin/login Methods : GET (inside the api it
will trigger post calls because i am using OAuth2 (linkedin))

All these above routes trigger the same API, but the role changes based
on the route accessed.

This triggers the LinkedIn authentication URL, redirecting the user to
the sign-in page to enter their email and password. After signing in,
LinkedIn provides an authorization code, which we send to the access
token API to receive an access token. We then use this token to fetch
user details from LinkedIn. If the user exists, we return a message
indicating that the user already exists; otherwise, we create a new user
with the LinkedIn ID, name, email, and role, and send the token back to
the client using cookies.

Middleware: setRole(role) This function adds the given role (like
\"user\") to the request, helping other parts of the code know what type
of user is making the request.

5\) http://localhost:3000/User/upload Description: Authenticated users
can upload assignments. Expects task and adminId in the request body.
Returns the created assignment. postman : Method: POST Headers:
Authorization: Bearer \<token\>

req.body{ \"adminId\":\"6707ee3cd19d35a72d2194a2\",
\"task\":\"assignment portal\" } output : { \"assignment\": {
\"userId\": \"6707e499777d1a00b45efddc\", \"task\": \"assignment
portal\", \"admin\": \"6707ee3cd19d35a72d2194a2\", \"status\":
\"pending\", \"\_id\": \"67081e29e9360f6b5920da76\", \"createdAt\":
\"2024-10-10T18:34:17.544Z\", \"\_\_v\": 0 } }

6\) http://localhost:3000/User/admins Description: Retrieves a list of
all admins from the user collection. Returns the list of admins.
Middleware: authenticateUser middleware will verify user token. postman
: Method: GET Headers: Authorization: Bearer \<token\> output : {
\"admins\": \[ { \"\_id\": \"6707ee3cd19d35a72d2194a2\", \"name\":
\"Lakshman Paga\", \"email\": \"lakshmanpaga@gmail.com\", \"role\":
\"admin\", \"linkedinId\": \"eoBKwj4dV7\", \"\_\_v\": 0 } \] }

7\) http://localhost:3000/Admin/assignments

Description: Allows authenticated admins to view assignments assigned to
them. Middleware: authenticateAdmin middleware will verify admin
identity. Postman: Method: GET Headers: Authorization: Bearer \<token\>
Response: Returns the list of assignments assigned to the authenticated
admin. output: { \"assignments\": \[ { \"\_id\":
\"670808c1ebeffd615d4aca84\", \"userId\": \"6707e499777d1a00b45efddc\",
\"task\": \"assignment portal\", \"admin\":
\"6707ee3cd19d35a72d2194a2\", \"status\": \"rejected\", \"createdAt\":
\"2024-10-10T17:02:57.175Z\", \"\_\_v\": 0 }, { \"\_id\":
\"67081e29e9360f6b5920da76\", \"userId\": \"6707e499777d1a00b45efddc\",
\"task\": \"assignment portal\", \"admin\":
\"6707ee3cd19d35a72d2194a2\", \"status\": \"pending\", \"createdAt\":
\"2024-10-10T18:34:17.544Z\", \"\_\_v\": 0 } \] }

8\) http://localhost:3000/Admin/assignments/:id/accept Description:
Admins can accept an assignment by its ID. No need to send anything in
the request body. It will be accepted by the assigned admin only.
Middleware: authenticateAdmin middleware will verify admin identity.
Postman: Method: POST Headers: Authorization: Bearer \<token\> URL
Parameters: :id --- ID of the assignment to be accepted. Response:
Updates the assignment status to \"accepted.\" output: {\"message\":
\"Assignment accepted\"}

9\) http://localhost:3000/Admin/assignments/:id/reject Description:
Admins can reject an assignment by its ID. No need to send anything in
the request body.It will be rejected by the assigned admin only.
Middleware: Requires authenticateAdmin middleware. Postman: Method: POST
Headers: Authorization: Bearer \<token\> URL Parameters: :id --- ID of
the assignment to be rejected. Response: Updates the assignment status
to \"rejected.\" output: {\"message\": \"Assignment rejected\"}
