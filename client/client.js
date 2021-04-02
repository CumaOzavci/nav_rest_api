var qte= require('quaternion-to-euler');
const axios = require('axios')
const roslib = require("roslib");

// Get Params
var params = require('./config/params.json');

var rate = params.rate || 1;
var robot_name = params.robot_name || "robot0";

var port = params.port || 9090;
var ip_address = params.ip_address || "localhost";
var host_ip_address = params.host_ip_address || "localhost";

// Wait 1 Second For WebSocket
function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
}
wait(1000);

// Local ROS Connection
let ros = new roslib.Ros({ url : `ws://${ip_address}:${port}` });

// AMCL Topic and Variable
var AmclPose;

let location = {
    x: 0,
    y: 0,
    th: 0
};

ros.on('connection', function() {
    AmclPose = new roslib.Topic({
        ros : ros,
        name : 'amcl_pose',
        messageType : 'geometry_msgs/PoseWithCovarianceStamped'
    });
    
    AmclPose.subscribe(message => {
        location.x = message.pose.pose.position.x;
        location.y = message.pose.pose.position.y;

        let qx = message.pose.pose.orientation.x;
        let qy = message.pose.pose.orientation.y;
        let qz = message.pose.pose.orientation.z;
        let qw = message.pose.pose.orientation.w;

        let euler = qte([qw, qx, qy, qz]);
        location.th = euler[2];
    });

    setInterval(updateServer, (1000 / rate));
});

// Update Server Periodically
function updateServer()
{
    axios.post(`http://${host_ip_address}:8080/api/robot`, {
        robot_name : robot_name,
        ip_address : ip_address,
        port : port,
        location_x : location.x,
        location_y : location.y,
        location_th : location.th
    })
    .then(res => {
    })
    .catch(error => {
        console.log("Could not update server");
    })
}
