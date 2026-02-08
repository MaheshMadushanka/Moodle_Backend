import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/db.config.js";
import RoleRoutes from "./routes/role.route.js";
import AdminRoutes from "./routes/admin.route.js";
import StudentRoutes from "./routes/student.route.js";
import LectureRoutes from "./routes/lecture.route.js";
import UserRoutes from "./routes/user.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());


// Connect database
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully");
    })
    .catch((error) => {
        console.error("Unable to connect to the database: ", error);
    });

// Table creation
sequelize
    .sync()
    .then(() => {
        console.log("Tables created");
    })
    .catch((error) => {
        console.error("Unable to create tables: ", error);
    });

// Main Routes

app.use('/api/role', RoleRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/student', StudentRoutes);
app.use('/api/lecture', LectureRoutes);
app.use('/api/user', UserRoutes);
// Run server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});