# Wolt 2021 Summer Internship Assignment Backend
Backend submission for [Wolt's 2021 Summer Internship assignment](https://github.com/woltapp/summer2021-internship), executed using Node.js, TypeScript, and Express.

The app is implemented mostly in `index.ts`, as the scope of the project doesn't really require a modular file structure. The given data (`restaurants.json`) is read on runtime, i.e. it can't be updated while the app is running. The app includes some custom types for the restaurant and response structures in `types.ts`.

## How to run
The app requires you to have [Node.js](https://nodejs.org/) installed.

1) Install the app's dependencies with your favoured package manager (`npm install` or `yarn install` / `yarn`)
2) Run the app with `npx start` or `yarn start`; this builds the TypeScript source and executes it afterwards.

By default the app is run with the port 8000, but you can specify that by supplying an environment variable `PORT` either via the shell environment or a `.env` file

## Scripts
 - `start` Builds the application, then runs it
 - `build` Only builds the application
 - `dev` Runs the application using `nodemon`, allowing live reloading
 - `lint` Runs ESLint on the project, and fixes any errors

## Environment Variables
 - `PORT` Port to run the app on. Defaults to `8000`