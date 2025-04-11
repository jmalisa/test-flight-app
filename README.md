# Flight Test Application
Welcome to the presentation of test assignment task - task is in description.

## Prerequisites
Before running this application, please ensure you have the following installed:

1. **Node.js** - Active LTS (Long Term Support) version
   - Download from [Node.js official website](https://nodejs.org/)
   - This will automatically install npm (Node Package Manager)
   - Verify installation by running:
     ```bash
     node --version
     npm --version
     ```

2. **Angular CLI**
   - Install globally using npm:
     ```bash
     npm install -g @angular/cli
     ```
   - Verify installation:
     ```bash
     ng version
     ```

## Running the Application
There are three ways to run this application:

### Method 1: Using Angular CLI (Recommended)
1. Navigate to the project directory:
   ```bash
   cd test-flight-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Method 2: Using npm scripts
1. Navigate to the project directory:
   ```bash
   cd test-flight-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Method 3: Using docker - prerequisite docker installed
1. Navigate to the project directory:
   ```bash
   cd test-flight-app
   ```

2. Build docker image:
   ```bash
   docker build -t my-app .
   ```

3. Start the application:
   ```bash
   docker run -d -p 4200:80 my-app
   ```

4. Open your browser and navigate to `http://localhost:4200`


## Development server
The application will automatically reload if you change any of the source files while the server is running.

## Need Help?
If you encounter any issues during setup or running the application, please check:
- Node.js and npm are properly installed
- You have the correct permissions to install global packages
- Your Node.js version is compatible with the Angular version used in this project
