class Robots {
    constructor() {
        this.robots = [];
    }

    update(request)
    {
        let index;
        for(index = 0; index < this.robots.length; index++)
        {
            if(this.robots[index].robot_name == request.robot_name)
            {
                this.robots[index].location_x = request.location_x;
                this.robots[index].location_y = request.location_y;
                this.robots[index].location_th = request.location_th;

                return;
            }
        }

        let robot = {
            robot_name : request.robot_name,
            ip_address : request.ip_address,
            port : request.port,
            location_x : request.location_x,
            location_y : request.location_y,
            location_th : request.location_th,
        }

        this.robots.push(robot);
    }

    get(robot_name = null)
    {
        if(robot_name)
        {
            let index;
            for(index = 0; index < this.robots.length; index++)
            {
                if(this.robots[index].robot_name == robot_name)
                {
                    return this.robots[index];
                }
            }
        }
        else if(this.robots.length > 0) return this.robots;

        return null;
    }

}

var robots = new Robots();

module.exports = robots;