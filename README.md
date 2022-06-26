
## GitHub-API Wrapper


A wrapper over GitHub API to automate some tasks  

## Build Status


## Features

- Create a repo with the name provided by the user
- List all Repos of a User
- Listing, updating, and deleting repo topics
- Listing all contributors, stargazers for a repository
- List all the repos of a given user with > 5 stars and > 5 forks
- List all the stargazers who have starred more than 2 repos of a given user
- List all the stargazers who have starred exactly 2 repos of a given user
- List all the repos of a given user with > 5 commits in last 10 days
- List all the repos of a given user with > 5 commits by owner in last 10 days


## Tech Stack for Backend

- [Typescript]    
- [Sentry] - Application monitoring and error tracking software
- [Express.js] - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications
- [octokit] - An npm package for accessing the GitHub API

## Documentation
I have created a OpenAPI v3.0.0 complaint API and have documented the same using Swagger Docs and have hosted the docs on Heroku.
Note: You need to add your personal access token in the x-github-token header for every request, otherwise it will show Unauthorised!
<p align="center">
<!-- <img src="https://cdn.discordapp.com/attachments/902114326905761793/980481929763770368/hostelverse_docs.png"/> -->
</p>
Link to documentation: https://githubapi-docs.herokuapp.com/docs/

## Installation

Install the dependencies and devDependencies and start the server.

```sh
cd GitHub-API-Wrapper
yarn install
yarn dev
```

## License

MIT

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Express.js]: <https://expressjs.com/>
   [Typescript]: <https://www.typescriptlang.org/>
   [Sentry]: <https://sentry.io/>
   [octokit]: <https://www.npmjs.com/package/octokit>
