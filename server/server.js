const express = require("express");
const app = express();

const map = require("./routes/map");
const goal = require("./routes/goal");
const twist = require("./routes/twist");
const robot = require("./routes/robot");
const initial_pose = require("./routes/initial_pose");
const clear_costmap = require("./routes/clear_costmap");

app.use(express.json());
app.use("/api/map", map);
app.use("/api/goal", goal);
app.use("/api/twist", twist);
app.use("/api/robot", robot);
app.use("/api/initial_pose", initial_pose);
app.use("/api/clear_costmap", clear_costmap);

app.listen(8080, () => {
    console.log("Connection established. Listening port 8080");
});