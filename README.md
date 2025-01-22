# [Chess FE Micro-Service](https://chess-fe-microservice.vercel.app)

### Abstract:
[//]: <> (Briefly describe what you built and its features. What problem is the app solving? How does this application solve that problem?)
This is a websocket chess game microservice that serves a chess game to a front end that handles user connections. It leverages the chess package https://github.com/Clariity/react-chessboard and socket.io for websocket connections.

### Installation Instructions:
[//]: <> (What steps does a person have to take to get your app cloned down and running?)
- This app is deployed and viewable at: chess-fe-microservice.vercel.app
- Clone this repository and install it using `npm i`.
- To run this app locally use `npm run dev` and navigate to the port vite runs the app on in your browser.
- If the backend server is down, you can install it and run it locally as well: https://github.com/frien-emies/chess-game-be and change the indicated lines in ChessSocket.js to point the application to the new endpoint.

### Testing Instructions:
To test the component, simply run the following command after installing the app's dependencies:

```npm run cy:open```

### Preview of App:
[//]: <> (Provide ONE gif or screenshot of your application - choose the "coolest" piece of functionality to show off.)
![app preview](/chess-demo.gif)
### Context:
[//]: <> (Give some context for the project here. How long did you have to work on it? How far into the Turing program are you?)
This project was created as a part of capstone project for the front end development course at Turing School Of Software And Design.

### Contributors:
[//]: <> (Who worked on this application? Link to their GitHubs.)
Liam Patrick: https://github.com/moth-dust.

Seth Way: https://github.com/seth-way.

Robert Phillips: https://github.com/robert-phillips33.

### Learning Goals:
[//]: <> (What were the learning goals of this project? What tech did you work with?)

The main goal of this project was to learn websocket technologies to leverage an existing chess library as one that can be played remotely between two clients.

### Wins + Challenges:
[//]: <> (What are 2-3 wins you have from this project? What were some challenges you faced - and how did you get over them?)
- It was challenging to figure out how manage multiple user connections playing different games simultaneously, we ended up coming up with several solutions with pros and cons to each.
- It was rewarding to not only have this service work on its own, but within the context of a larger social app.
