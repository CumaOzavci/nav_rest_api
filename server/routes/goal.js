const express = require("express");
const router = express.Router();
const roslib = require("roslib")
const Joi = require('joi');

var robots = require("../Robots");

router.post("/", (req, res) => {
    // Check if request is valid
    const { error, value } = validateInitialPoseRequest(req.body);
    if(error) return res.status(403).send(error.details[0].message);

    // Check if robot exist
    const robot = robots.get(req.body.robot_name);
    if(!robot) return res.status(404).send("No robot was found with given name");

    // SEND GOAL
    let px = parseFloat(req.body.location_x);
    let py = parseFloat(req.body.location_y);

    // Calculate the quaternion
    let th_x = 0.0;
    let th_y = 0.0;
    let th_z = parseFloat(req.body.location_th);

    let cy = Math.cos(th_z*0.5);
    let sy = Math.sin(th_z*0.5);
    let cr = Math.cos(th_x*0.5);
    let sr = Math.sin(th_x*0.5);
    let cp = Math.cos(th_y*0.5);
    let sp = Math.sin(th_y*0.5);

    let qw = (cy*cr*cp + sy*sr*sp);
    let qx = (cy*sr*cp - sy*cr*sp);
    let qy = (cy*cr*sp + sy*sr*cp);
    let qz = (sy*cr*cp - cy*sr*sp);

    let ros = new roslib.Ros({ url : `ws://${robot.ip_address}:${robot.port}` });

    ros.on("connection", () => {
        let MoveBaseGoal = new roslib.Topic({
            ros: ros,
            name: 'move_base/goal',
            messageType: 'move_base_msgs/MoveBaseActionGoal'
        });
    
        let goalmsg = new roslib.Message({
            header : {
                seq: 0,
                stamp : {
                    secs : 0,
                    nsecs : 0
                },
                frame_id : "map"
            },
            goal_id: {
                stamp: {
                    secs: 0,
                    nsecs: 0
                },
                id: ''
            },
            goal: {
                target_pose: {
                    header : {
                        seq: 0,
                        stamp : {
                            secs : 0,
                            nsecs : 0
                        },
                        frame_id : "map"
                    },
                    pose : {
                        position : {
                            x : px,
                            y : py,
                            z : 0.0
                        },
                        orientation : {
                            x : qx,
                            y : qy,
                            z : qz,
                            w : qw
                        },
                    }
                }
            }
        });
    
        MoveBaseGoal.publish(goalmsg);
        res.send("Goal sent successfuly");
        
        setTimeout(() => ros.close(), 3000);
    });

    ros.on("error", (error) => {
        res.status(500).send(error.error.code);
    });
});

router.delete("/", (req, res) => {
    // Check if request is valid
    const { error, value } = validateDeleteRequest(req.body);
    if(error) return res.status(403).send(error.details[0].message);

    // Check if robot exist
    const robot = robots.get(req.body.robot_name);
    if(!robot) return res.status(404).send("No robot was found with given name");

    // CANCEL CURRENT GOAL

    let ros = new roslib.Ros({ url : `ws://${robot.ip_address}:${robot.port}` });

    ros.on("connection", () => {
        let MoveBaseCancel = new roslib.Topic({
            ros: ros,
            name: 'move_base/cancel',
            messageType: 'actionlib_msgs/GoalID'
        });
    
        let deletemsg = new roslib.Message({
            stamp : {
                secs : 0,
                nsecs : 0
            },
            id : ''
        });
    
        MoveBaseCancel.publish(deletemsg);
        res.send("Cancel request send");

        setTimeout(() => ros.close(), 3000);
    });

    ros.on("error", (error) => {
        res.status(500).send(error.error.code);
    });
})

validateGoalRequest = (request) => {
    const schema = Joi.object({
        robot_name: Joi.string().min(2).max(100).required(),
        location_x: Joi.number().required(),
        location_y: Joi.number().required(),
        location_th: Joi.number().required(),
    });

    return schema.validate(request);
}

validateDeleteRequest = (request) => {
    const schema = Joi.object({
        robot_name: Joi.string().min(2).max(100).required()
    });

    return schema.validate(request);
}

module.exports = router;