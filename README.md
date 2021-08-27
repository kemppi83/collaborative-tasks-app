#Collaborative tasks

Collaborative tasks allows you to keep up to date with your tasks and collaborate with a friend or a colleague in real time. After signing up, you can create Todos. Upon creation, you can add other Collaborative tasks users as collaborators in the Todo. You do this by giving their email addresses in the form.

When the Todo is created, you can see its details and modify it by clicking the button "Show details". You and your collaborators can add and remove tasks and mark them as done or active.

The backend source code can be found [here](https://github.com/kemppi83/collaborative-tasks). It uses MongoDB database through Mongoose to store user data. Authentication is done through the backend using Google Firebase as the service provider.

The app was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

Socket.io was used to communicate statefully with the backend through web sockets.

Styling was done using Tailwind CSS.

Collaborative tasks is live [here](https://collaborative-tasks.netlify.app/)!
