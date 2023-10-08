import express from 'express';
import router from "./routes/user.js";
import cookieparser from 'cookie-parser';

const app = express();
const port = 3000;

app.set('views', 'views')
app.set('view engine', 'ejs');

app.use(cookieparser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});