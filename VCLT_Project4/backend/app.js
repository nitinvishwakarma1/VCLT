import express from 'express';
import router from "./routes/user.js";
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import path from 'path';

const app = express();
const port = 3000;

// Manually assign the project root directory to currentWorkingDirectory
const currentWorkingDirectory = "C:/Users/lenovo/Desktop/projects/VCLT_Project4";

// Construct the paths relative to the project's root directory
const rootDirectory = currentWorkingDirectory;

app.set('views', path.join(rootDirectory, 'backend/views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(expressSession({ secret: "mysecretkey", saveUninitialized: true, resave: true }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(rootDirectory, 'backend/public'))); // Serve public files from the 'public' directory
app.use("/", router);

app.use(express.static(path.join(rootDirectory, 'frontend/build'))); // Serve static files from the 'frontend/build' directory
app.get('/moto', (req, res) => {
  console.log("visited");
  res.sendFile(path.join(rootDirectory, 'frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
