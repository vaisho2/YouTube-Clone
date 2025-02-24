# YouTube Clone

### Project Overview

This is a full-stack YouTube Clone built using the MERN Stack (MongoDB, Express.js, React, and Node.js). The application allows users to:

Browse and watch videos.

Create an account and authenticate using JWT.

Upload, edit, and delete videos.

Comment on the videos.

Create and manage channels.

Search and filter videos.

Have a fully responsive UI across different devices.

### Tech Stack

#### Frontend:

React.js

React Router

Redux (for state management)

Axios (for API requests)

Firebase (for authentication if used)

Tailwind CSS / Custom CSS for styling

Vite (for faster development and bundling)

##### Backend:

Node.js

Express.js

MongoDB(MongoDB Atlas) & Mongoose (for database management)

JWT (for authentication)

bcrypt (for password hashing)

### Folder Structure

backend/
│-- Models/
│   ├── channel.js
│   ├── comments.js
│   ├── user.js
│   ├── videos.js
│-- Routes/
│   ├── channelRouter.js
│   ├── commentRouter.js
│   ├── userRouter.js
│   ├── videoRouter.js
│-- node_modules/
│-- .env
│-- package.json
│-- package-lock.json
│-- server.js

Backend Explanation:

Models/: Contains Mongoose schemas for Users, Videos, Channels, and Comments.

Routes/: Defines API endpoints for authentication, videos, comments, and channels.

server.js: The entry point for the backend API.

.env: Stores sensitive credentials (MongoDBAtlas URI, JWT secret, etc.).

FrontEnd/
│-- public/
│-- src/
│   ├── assets/
│   ├── Components/
│   │   ├── AccountPop.jsx
│   │   ├── Browse.jsx
│   │   ├── ChannelDetails.jsx
│   │   ├── ChannelVideos.jsx
│   │   ├── Content.jsx
│   │   ├── Error.jsx
│   │   ├── LeftPanel.jsx
│   │   ├── LoadingComponent.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchResults.jsx
│   │   ├── Signin.jsx
│   │   ├── Signup.jsx
│   │   ├── VideoSection.jsx
│   ├── Css/
│   ├── img/
│   ├── reducer/
│   │   ├── impDetails.js
│   ├── App.css
│   ├── App.jsx
│   ├── Firebase.js
│   ├── index.css
│   ├── main.jsx
│   ├── store.js
│   ├── useNotification.js
│-- .gitignore
│-- index.html
│-- package.json
│-- package-lock.json
│-- README.md
│-- vite.config.js

Components/: Contains reusable React components such as Navbar, Video Section, Channel Details, etc.

Reducers/: Handles global state management (Redux).

Firebase.js: Config for authentication (if Firebase is used).

useNotification.js: Custom hook for notifications.

App.jsx: Main component integrating all pages.

store.js: Redux store configuration.

vite.config.js: Configuration for Vite.


### Features

1. Authentication (JWT-based login/signup)

Users can register and log in using an email and password.

JWT is used to store authentication tokens securely.

User authentication state is managed globally.

2. Home Page

Displays a list of video thumbnails.

Sidebar for navigation.

Filter buttons for category-based filtering.

3. Video Player Page

Embedded video player.

Displays title, description, and channel info.

Like/Dislike buttons.

Comment section (Users can add, edit, and delete comments).

4. Channel Page

Users can create and manage their own channels.

Displays all videos uploaded by a channel.

Option to delete/edit uploaded videos.

5. Search and Filtering

Users can search for videos using a search bar.

Filter videos based on category.

6. Responsive UI

Works seamlessly across desktop, tablet, and mobile devices.

### Installation and Setup

1. Clone the Repository

git clone https://github.com/vaisho2/YouTube-Clone.git

cd YouTube Clone

2. Set Up Backend

cd backend
npm install

Create a .env file inside backend and add port,token,url

Run the backend server:

npm start

3. Set Up Frontend

cd FrontEnd
npm install
npm run dev


### GitHub Repository

https://github.com/vaisho2/YouTube-Clone.git