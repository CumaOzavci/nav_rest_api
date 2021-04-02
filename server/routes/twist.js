const express = require("express");
const router = express.Router();
const roslib = require("roslib")
const Joi = require('joi');

var robots = require("../Robots");

router.post("/", (req, res) => {
    // Check if request is valid
    const { error, value } = validateTwistRequest(req.body);
    if(error) return res.status(403).send(error.details[0].message);

    // Check if robot exist
    const robot = robots.get(req.body.robot_name);
    if(!robot) return res.status(404).send("No robot was found with given name");

    // SEND TWIST COMMAND
    let linear = parseFloat(req.body.linear_speed);
    let angular = parseFloat(req.body.angular_speed);

    let ros = new roslib.Ros({ url : `ws://${robot.ip_address}:${robot.port}` });

    ros.on("connection", () => {
        let Twist = new roslib.Topic({
            ros: ros,
            name: 'cmd_vel',
            messageType: 'geometry_msgs/Twist'
        });
    
        let twistmsg = new roslib.Message({
            linear:{
                x: linear,
                y: 0,
                z: 0
            },
            angular:{
                x: 0,
                y: 0,
                z: angular
            }
        });
    
        Twist.publish(twistmsg);
        res.send("Twist sent successfuly");
        
        setTimeout(() => ros.close(), 3000);
    });

    ros.on("error", (error) => {
        res.status(500).send(error.error.code);
    });
});

validateTwistRequest = (request) => {
    const schema = Joi.object({
        robot_name: Joi.string().min(2).max(100).required(),
        linear_speed: Joi.number().required(),
        angular_speed: Joi.number().required(),
    });

    return schema.validate(request);
}

module.exports = router;