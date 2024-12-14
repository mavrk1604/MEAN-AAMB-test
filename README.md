
# Tasks App

A task management application built using the MEAN stack.

## **Technologies Used**:
- **Frontend**: Angular 19
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## **How to Use the App**

### **Backend Setup**:
1. Clone the repository:
   ```bash
   git clone https://github.com/mavrk1604/MEAN-AAMB-test.git
   ```
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Create a `.env` file in the `backend` folder and add the following environment variables:
   ```
   MONGO_URL=your_mongodb_connection_string
   PORT=5000
   ```
   Replace `your_mongodb_connection_string` with your own MongoDB URI.

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the backend server:
   ```bash
   npm run start
   ```
   The backend server will run on `http://localhost:5000` by default.

### **Frontend Setup**:
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   ng serve -o
   ```
   This will open the application in your default web browser at `http://localhost:4200`.

## **Features**:
1. **Task Management**:
   - Create, view, edit, and delete tasks.
   - The tasks list will initially be empty until you create your first task.

2. **Task Details**:
   - Click the **View/Edit** button next to a task to view its complete details.
   - Modify any fields and save changes as needed.

3. **Search and Filter**:
   - Use the search bar at the top to look for tasks by name.
   - Filter tasks by:
     - **Status**
     - **Priority**
     - **Tags**

## **Deployment Notes**:
- Ensure the backend server is accessible to the frontend for CRUD operations with MongoDB.

## **Additional Notes**:
- A postman collection has been added to the root directory of the repository, the collection includes pre-configured requests for testing all CRUD endpoints.
