import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/vclt", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connection sucessful'))
    .catch((err) => console.log(err));

export default mongoose;