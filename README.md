# 🎓 Smart LMS Peer Mentoring System

## 🌟 **Overview**

The Smart LMS Peer Mentoring System is an AI-powered platform that connects high-performing students (mentors) with students who need academic help (mentees). This system creates a collaborative learning environment where students can help each other succeed.

## 🚀 **Key Features**

### 1. **AI-Powered Mentor Matching**
- Automatically identifies students with grades ≥80% as potential mentors
- Matches mentors and mentees based on course performance
- Ensures quality mentoring relationships

### 2. **Real-Time Chat System**
- Secure messaging between mentors and mentees
- File sharing capabilities
- Message read receipts
- Auto-refresh every 10 seconds

### 3. **Mentor Request System**
- Students can request help for specific subjects
- Detailed help descriptions
- Mentor acceptance workflow
- Status tracking (pending, accepted, completed)

### 4. **Performance Tracking**
- 5-star rating system for both mentors and mentees
- Feedback collection
- Progress monitoring
- Relationship status management

### 5. **Comprehensive Dashboard**
- Overview of all mentoring relationships
- Statistics and metrics
- Quick access to active chats
- Request management

## 🏗️ **Technical Architecture**

### **Backend (Node.js + Express +SQL)**

#### Database Schema
```sql


cd backend
npm install
npx knex migrate:latest
npx knex seed:run
node src/index.js

cd frontend
npm install
npm run dev


Made a change
