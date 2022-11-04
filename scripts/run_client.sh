#!/bin/bash

source ~/colcon_ws/install/setup.bash
colcon_cd nav_rest_api
cd client
node client.js
