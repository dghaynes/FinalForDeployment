# 330-sp25-class-3-final-dghaynes

# Project Proposal: AI Chat Application using MERN Stack and Amazon Bedrock


## Update 5/21/2025

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


