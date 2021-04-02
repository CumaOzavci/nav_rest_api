const express = require("express")
const router = express.Router();
const Joi = require('joi');

var robots = require("../Robots");

router.get("/", (req, res) => {
    let robot_name;
    if(req.body.robot_name) robot_name = req.body.robot_name;

    const robot_list = robots.get(robot_name);
    if(!robot_list) return res.status(404).send("No robot(s) were found with given name(s)");

    return res.send(robot_list);
});

router.post("/", (req, res) => {
    // Check if request is valid
    const { error, value } = validateRobotRequest(req.body);
    if(error) return res.status(403).send(error.details[0].message);

    robots.update(req.body);

    res.send("Robot added/updated");
})

validateRobotRequest = (request) => {
    const schema = Joi.object({
        robot_name: Joi.string().min(2).max(100).required(),
        ip_address: Joi.string(),
        port: Joi.number(),
        location_x: Joi.number().required(),
        location_y: Joi.number().required(),
        location_th: Joi.number().required(),
    });

    return schema.validate(request);
}

module.exports = router;