const express = require("express")
const router = express.Router();
const roslib = require("roslib")
const Joi = require('joi');

var robots = require("../Robots");

router.post("/", (req, res) => {
    // Check if request is valid
    const { error, value } = validateClearCostmapRequest(req.body);
    if(error) return res.status(403).send(error.details[0].message);

    // Check if robot exist
    const robot = robots.get(req.body.robot_name);
    if(!robot) return res.status(404).send("No robot was found with given name");


    let ros = new roslib.Ros({ url : `ws://${robot.ip_address}:${robot.port}` });

    ros.on("connection", () => {
        let clear_costmap_client = new roslib.Service({
            ros : ros,
            name : 'move_base/clear_costmaps',
            serviceType : 'std_srvs/Empty'
        });

        var clear_costmap_request = new roslib.ServiceRequest({});

        clear_costmap_client.callService(clear_costmap_request, (result) => {
            res.send("Costmap cleared");
            ros.close();
        });
    });

    ros.on("error", (error) => {
        res.status(500).send(error.error.code);
    });
})

validateClearCostmapRequest = (request) => {
    const schema = Joi.object({
        robot_name: Joi.string().min(2).max(100).required(),
    });

    return schema.validate(request);
}


module.exports = router;