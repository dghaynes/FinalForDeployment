# 330-sp25-class-3-final-dghaynes

# Project Proposal: AI Chat Application using MERN Stack and Amazon Bedrock

---
# Final update before submission - 6/02/2025

### Status summary to include the Bedrock service integration:

1. Unit Testing Status:
- Unit tests were written but proved to be challenging
- This was the most time-consuming part of the development
- Time constraints affected the completion of all desired tests

2. Deployment Status:
- Successfully deployed the application on Railway platform
- Application is live and accessible at: https://finalfordeployment-production.up.railway.app/
- The API endpoints are functional at:
    * Create Project: /chat/create-project
    * Update Project: /chat/update-project/:id/prompts
    * See below for more route documentation
  

3. Database Status:
- Successfully connected to MongoDB Atlas as a cloud database service
- Database configuration and connection is working in production
- Data persistence is properly implemented through MongoDB Atlas

4. AI Integration Status:
- Successfully integrated Amazon Bedrock service
- Implemented chat prompting functionality
- Handles AI-powered responses through Bedrock

5. Frontend Status:
- Frontend development was not completed due to time constraints
- Currently only backend API endpoints are available
- Frontend implementation remains as a pending task

Recommendations for future improvements:
1. Develop the frontend interface
2. Allocate more time for unit testing
3. Consider implementing additional test coverage
4. Create a user-friendly interface to interact with the API endpoints

---
## API Route Update - User Signup

`POST /user/signup`

### Endpoint Details
- **URL**: https://finalfordeployment-production.up.railway.app/user/signup
- **Method**: POST
- **Content-Type**: application/json

### Request Body Format
```json
{
    "email": "string",
    "password": "string"
}
```

### Example Request
```json
{
    "email": "dghaynes@proton.me",
    "password": "[PASSWORD]"
}
```

### Testing Instructions
- Use a REST client (like Postman) or cURL to test the endpoint
- Ensure to include both email and password fields in the request body
- The request must be sent as JSON format

---

## API Route Update - User Login

## New Route Added
`POST /user/login`

### Endpoint Details
- **URL**: https://finalfordeployment-production.up.railway.app/user/login
- **Method**: POST
- **Content-Type**: application/json

### Request Body Format
```json
{
    "email": "string",
    "password": "string"
}
```

### Example Request
```json
{
    "email": "example@email.com",
    "password": "[[PASSWORD]]"
}
```

### Testing Instructions
- Use a REST client (like Postman) or cURL to test the endpoint
- Ensure both email and password fields are included in the request body
- The request must be sent as JSON format
- Use valid credentials that were previously registered through the signup endpoint

---
Please ensure to test the endpoint and report any issues encountered.

## API Route Update - Chat LLM Endpoint

`POST /chat/llm`

### Endpoint Details
- **URL**: https://finalfordeployment-production.up.railway.app/chat/llm
- **Method**: POST
- **Content-Type**: application/json

### Request Body Format
```json
{
    "type": "text",
    "text": "string"
}
```

### Example Request
```json
{
    "type": "text",
    "text": "Who is Scott Galloway?"
}
```

### Testing Instructions
- Use a REST client (like Postman) or cURL to test the endpoint
- Ensure both "type" and "text" fields are included in the request body
- The request must be sent as JSON format
- The "type" field should be set to "text"
- The "text" field should contain your question or prompt

---

## API Route Update - Create Project

### New Route Added
`POST /chat/create-project`

### Endpoint Details
- **URL**: https://finalfordeployment-production.up.railway.app/chat/create-project
- **Method**: POST
- **Content-Type**: application/json

### Request Body Format
```json
{
    "user": "string"
}
```

### Example Request
```json
{
    "user": "683e6917302d8d5cd94bd732"
}
```

### Testing Instructions
- Use a REST client (like Postman) or cURL to test the endpoint
- Ensure the "user" field is included in the request body with a valid user ID
- The request must be sent as JSON format
- The user ID should be a valid MongoDB ObjectId

---

## API Route Update - Update Project Prompts

### New Route Added
`POST /chat/update-project/{projectId}/prompts`

### Endpoint Details
- **URL**: https://finalfordeployment-production.up.railway.app/chat/update-project/683e6a98302d8d5cd94bd735/prompts
- **Method**: POST
- **Content-Type**: application/json

### Request Body Format
```json
{
    "prompt": "string",
    "response": "string"
}
```

### Example Request
```json
{
    "prompt": "What is the difference between AI and ML?",
    "response": "AI (Artificial Intelligence) and ML (Machine Learning) are related concepts but have distinct differences:..."
}
```

### Testing Instructions
- Use a REST client (like Postman) or cURL to test the endpoint
- Ensure both "prompt" and "response" fields are included in the request body
- The request must be sent as JSON format
- The projectId in the URL should be a valid MongoDB ObjectId
- The response field can contain formatted text with line breaks

---

## API Route Documentation - Post Prompt to Project

### Endpoint Details
`POST /chat/update-project/:id/prompts`

### URL
- Base URL: https://finalfordeployment-production.up.railway.app
- Endpoint: /chat/update-project/:id/prompts
- Note: Replace `:id` with your actual project ID

### Method
POST

### Request Headers
Content-Type: application/json

### Request Body Format
```json
{
    "prompt": "string",
    "response": "string"
}
```

### Example Request
```json
{
    "prompt": "What is the difference between AI and ML?",
    "response": "AI (Artificial Intelligence) and ML (Machine Learning) are related concepts but have distinct differences:..."
}
```

### Testing Instructions
1. Replace `:id` in the URL with your actual project ID
2. Ensure your request includes both "prompt" and "response" fields
3. Send the request as JSON format
4. The response field can contain formatted text with line breaks (\n)
5. Use a valid project ID that exists in your database

---



# Update 5/21/2025

Completed Items:
- Successfully implemented backend API route for chat prompting with Amazon Bedrock integration
- Established chat history storage functionality using MongoDB

Next Focus Areas:
1. Project-based organization for chat history
2. User authentication implementation with JWT
3. Role-based permissions for express routes
4. Testing implementation with JEST (targeting 80% coverage)

Stretch Goal:
- React-based Chat UI development
- Deploy Front End and Back End


## 1. Project Overview

This project proposes the development of a **full-stack AI-powered chat application** using the **MERN stack (MongoDB, Express, React, Node.js)** and **Amazon Bedrock** for natural language processing. The application will allow users to interact in real time with a chatbot powered by a large language model (LLM) hosted on Amazon Bedrock (e.g., Claude, Titan, or LLaMA). All user messages and responses will be securely stored in a MongoDB database, with optional user authentication.

---

## 2. Objectives

- Build a responsive and user-friendly chat interface using **React**
- Implement backend message handling using **Node.js and Express**
- Integrate **Amazon Bedrock** to generate intelligent responses to user input
- Store chat history and user sessions in **MongoDB**
- Add **JWT-based authentication** to support multi-user interaction and private chat logs

---

## 3. Key Features

- 🔹 Real-time chat interface (React-based UI)
- 🔹 Backend API to route chat messages to Amazon Bedrock
- 🔹 Integration with Bedrock models (e.g., Anthropic Claude)
- 🔹 Storage of chat history in MongoDB

---

## 4. Technical Architecture

### Frontend (React)

- Chat UI with input box, send button, and message history
- Axios for API requests
- Optional: Context for state management

### Backend (Node.js + Express)

- API route: `POST /api/chat` to handle incoming messages
- Integration with Amazon Bedrock using AWS SDK
- Database interaction with MongoDB
- User authentication via JWT

### Amazon Bedrock Integration

- Use `@aws-sdk/client-bedrock-runtime`
- Call LLMs like `anthropic.claude-v2` or `amazon.titan-text-lite-v1`
- Handle prompt formatting and output parsing

---

# 5. Project Milestones (3-Week Timeline)

| **Week 1** | **Setup & Frontend** |  

- Initialize MERN boilerplate (React, Node.js, Express, MongoDB)  
- Configure Amazon Bedrock access (IAM, credentials, SDK setup)  
- Build chat UI: input box, message list, send button  
- Optional: Style with TailwindCSS or Material UI  

| **Week 2** | **Backend & Bedrock Integration** |  

- Create Express backend with `/api/chat` POST route  
- Integrate Amazon Bedrock SDK and connect to selected LLM  
- Handle prompt formatting and response parsing  
- Store chat messages in MongoDB  
- Build frontend logic to send/receive messages from backend  

| **Week 3** | **Polish, Testing & Deployment** |

- Test Bedrock integration with multiple prompts  
- Add input validation, error handling, and message persistence  
- Add basic JWT user auth  
- Optional: Deploy backend (Render, Railway, or Heroku)  
- Optional: Deploy frontend (Vercel or Netlify)  
- Final QA and performance testing  
|

---

## 6. Tools & Dependencies

- **Frontend**: React, Axios, Optional - TailwindCSS or Material UI
- **Backend**: Node.js, Express, AWS SDK for Bedrock
- **Database**: MongoDB (Atlas or local)
- **Deployment**: Vercel/Render (frontend), Railway/Heroku (backend)
- **AWS Services**: Amazon Bedrock, IAM roles, SDK credentials


