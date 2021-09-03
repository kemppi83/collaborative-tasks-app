# Collaborative tasks

Collaborative tasks allows you to keep up to date with your tasks and collaborate with a friend or a colleague in real time. After signing up, you can create Todos. Upon creation, you can add other Collaborative tasks users as collaborators in the Todo. You do this by giving their email addresses in the form. N.b. the collaborator must have signed up before they are added in the list!

When the Todo is created, you can see its details and modify it by clicking the button "Show details". You and your collaborators can add and remove tasks and mark them as done or active.

The backend source code can be found [here](https://github.com/kemppi83/collaborative-tasks). It uses MongoDB database through Mongoose to store user data. Authentication is done through the backend using Google Firebase as the service provider.

The app was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

Socket.io was used to communicate statefully with the backend through web sockets.

Styling was done using Tailwind CSS.

Collaborative tasks is live [here](https://collaborative-tasks.netlify.app/)!
My portfolio can be found [here](https://juhakemppinen.tech/.)

## Thoughts about the project

I learned Typescript through this project and I wanted to do it properly. I spent a lot of time setting up the linter and test configurations. I also wanted to get more comfortable with working on Redux and Redux-toolkit was a good, opinionated option. I will need to work with pure Redux in another project to be able to form my opinion on which I like better.

It seems to be more common to have authentication and login implemented in the frontend and only verify the ID token (an example of a decoded token shown below) in the backend when accessing secure api routes. I decided to rather have the whole authentication logic in my backend to try it out. Google Firebase is a good platform for both implementation ways.

This was also the first time I used web sockets. Socket.io makes it simple, but it took me a while to figure out how to fit both a REST api and the web sockets in the puzzle. I'm quite happy with the result.

I added some simple unit tests, but I want to create integration tests for both the frontend and the backend in the future. In the backend, to check that the controllers communicate properly with the database through Mongoose. In the frontend, I need to mock an api and Redux store to check that my features/components communicate properly with them.
