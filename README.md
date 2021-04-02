# nav_rest_api
A ROS REST API for controlling autonomous vehicles.

## Installation
- Install [Node.js](https://nodejs.org/en/download/)
- On server, go to `server` directory and run `npm install`
- On client, go to `client` directory and run `npm install`

## Configuration
- On server, go to `server/map` directory. Put your map here and fill `map.json` file with your map specs. It would ne better, if you convert it to .png file
- On client, go to `client/config` directory. Update `params.json` with your parameters. If both server and client will run on same computer, you can leave ip_adresses as `localhost`.
- Go to `scripts` folder and update scripts with your catkin workspace.

## Running
- On server, run `roslaunch nav_rest_api server.launch`
- On client, run `roslaunch nav_rest_api client.launch`

## Notes
- Currently, there is not any security features.
- This package does not provide any autonomy. Navigation Stack should be already up and running.
- While you can use seperate computers/vehicles for server and client, you can also use both on same computer.
- You can use an API client such as [Insomnia](https://insomnia.rest/) to easily test API. Also you can find my Imsonmia document at `insomnia.txt`. 

Feel free to open an issue for bug reports and any requests.
