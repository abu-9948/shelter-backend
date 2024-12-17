Shelter (React.js | PostgreSQL | MongoDB | Express.js | Node.js | JWT | bcrypt.js | AWS | Docker | Git)

A web application designed to help users locate shelters and accommodations in their preferred areas.

Search Functionality: Users can search for shelters based on location, availability, and specific filters.
User Authentication & Security: Implemented secure user authentication using JWT and bcrypt.js for booking management and profile handling.
Full-Stack Development: The backend was built with Node.js and Express.js for efficient API handling and integrated with MongoDB and PostgreSQL for robust data management.
Deployment & Scaling: The application is deployed on AWS with containerization using Docker for scalability and ease of maintenance.


Here’s a **step-by-step guide** that you can add to your **README** file for your teammates. This will help them contribute and update the codebase seamlessly.

---

# **Project Setup and Contribution Guide**

Welcome to the project! Follow the steps below to set up the project, make updates, and contribute.

---

### **1. Clone the Repository**

To get a local copy of the code, you need to clone the repository from GitHub.  
Run the following command in your terminal:

```bash
git clone <repository-url>
```

Example:

```bash
git clone https://github.com/your-username/shelter.git
```

---

### **2. Install Project Dependencies**

The project uses **Node.js**, and you'll need to install dependencies defined in the `package.json` file.  
To install them, run:

```bash
npm install
```

This will install all required dependencies in the `node_modules` folder.

---

### **3. Set Up Environment Variables**

The project uses a `.env` file for sensitive configuration. Since this file is not included in the repository for security reasons, you need to get a copy of the `.env` file from the team.  
Once you have the `.env` file, place it in the root folder of the project directory.

---

### **4. Sync with the Latest Code**

Before starting to make changes, ensure your local repository is up to date with the latest changes.  
Run the following command to fetch and merge changes from the `master` branch:

```bash
git pull origin master
```

---

### **5. Create a New Branch (Optional but Recommended)**

For a clean workflow, it's recommended to work on your own branch for any feature or bugfix.  
To create a new branch, run:

```bash
git checkout -b feature/your-feature-name
```

Replace `your-feature-name` with the name of the feature or fix you're working on.

---

### **6. Make Changes**

Now, you can make changes to the project files, whether it’s adding a feature, fixing a bug, or improving the code.

---

### **7. Stage and Commit Changes**

Once your changes are done, stage the modified files and commit them.  
First, stage all changes:

```bash
git add .
```

Then, commit the changes with a meaningful message:

```bash
git commit -m "Add a meaningful commit message describing your changes"
```

---

### **8. Push Changes to GitHub**

After committing the changes, push your branch to GitHub:

```bash
git push origin feature/your-feature-name
```

---

### **9. Open a Pull Request (PR)**

Go to the GitHub repository page and create a **Pull Request** from your branch to `master`.

- Go to the repository on GitHub.
- You should see an option to create a **Pull Request**.
- Add a title and description of the changes you made.
- Request reviews from other team members if needed.

Once the code is reviewed and approved, it can be merged into the `master` branch.

---

### **10. Pull Changes Frequently**

While working on your feature, it's a good idea to pull the latest changes from `master` regularly to avoid conflicts.

```bash
git pull origin master
```

---

### **11. Merge Code After Review**

Once the PR is approved, merge your code into the `master` branch and delete the feature branch if necessary.

---

### **12. Sync Your Local Repository After Merging**

After the PR is merged, make sure to pull the latest changes to keep your local repository up-to-date.

```bash
git pull origin master
```

---

### **Summary**

To contribute to the project, follow these steps:
1. Clone the repository with `git clone <repository-url>`.
2. Install dependencies with `npm install`.
3. Set up the `.env` file by obtaining it securely from the team.
4. Pull the latest changes from `master` with `git pull origin master`.
5. Create a new branch: `git checkout -b feature/your-feature-name`.
6. Make your changes and test them locally.
7. Stage and commit your changes.
8. Push your branch: `git push origin feature/your-feature-name`.
9. Open a Pull Request on GitHub.
10. Sync regularly with `git pull origin master` to avoid conflicts.
11. Merge after approval and pull the latest changes.

---

Feel free to reach out if you have any questions!

---

### **Happy Coding!** 🚀

--- 
