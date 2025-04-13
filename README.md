# 📝 Add Post App

A full-stack web application built with **React.js** for the frontend and **Appwrite** for backend services. This app allows users to **sign up**, **log in**, **create posts**, **edit**, **delete**, and **like** posts. All posts are displayed on the main page.

## 🚀 Features

- 🔐 User Authentication (Signup/Login/Logout)
- ➕ Add a new post with content and optional image
- ✏️ Edit your own posts
- ❌ Delete your own posts
- ❤️ Like any post (prevent duplicate likes & allow unliking)
- 📃 View all posts
- 🖼️ Upload and delete images using Appwrite Storage
- 🔄 Persistent post data using Appwrite Database

## 🧰 Tech Stack

**Frontend:**
- React.js
- Redux (for auth state management)
- HTML React Parser (for rendering post content)

**Backend:**
- Appwrite (Authentication, Database, Storage)

## 📁 Folder Structure (Frontend)


*#.env 
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
