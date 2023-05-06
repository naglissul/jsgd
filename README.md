# JSGD - Java Script Game Development **or** Just Some Great Dancing :)

Multiplayer web game, where players are jumping around the canvas trying to pixel-draw the mario.

Use this link to play: [jsgd.web.app](https://jsgd.web.app)

## About

Current version: v1.2.0

Check the [CHANGELOG.md](/CHANGELOG.md) for more version descriptions.

You can also find some useless pseudo-legal docs here:

-   [LICENSE](/LICENCE.md)
-   [TERMS AND CONDITIONS](/TERMSANDCONDITIONS.md)
-   [PRIVACY POLICY](/PRIVACYPOLICY.md)

or here: [link](https://npw.lt/#/code)

## Tech

-   HTML Canvas
-   CSS
-   Vanilla Javascript - OOP structure
-   Firebase anonymous auth & realtime db
-   VS Code & Prettier

## Deployment

-   Server side - Linode
-   Client(player) side - Firebase hosting
-   Development and Releases - GitHub

## More about the program

### Run on your local machine

Just open ./public/index.html file in your browser

### Server side deployment process

1. Server side is being hosted on linux server, using Linode services
2. ./serverSide/ files (without node modules) together with additional admin-private.json file (with firebase admin data) are transfered to the server:

    - scp <file_names> root@IP_ADDRESS:/root

3. Then node version 14 is installed on VM (check with "node -v"):

    - curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
    - sudo apt -y install nodejs

4. Then npm is installed:
    - sudo apt install npm
5. Then node modules are installed:
    - npm install
6. Then the server-side.js is run with node command (in the background) (check with "ps aux | grep server-side.js"):
    - nohup node your-script.js > output.log 2>&1 &
