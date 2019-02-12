## Simple web games

This is a very simple repo to practice React Hooks and python. Each game has a React frontend and a stateless python 
computer player. The games I am making are all stateless so the idea is you send the entire board state and the
python side decides the next logical move. 

## Setup

There are two components to this code: the web-based frontend and the python backend.

To get the frontend up and running in development, you can run `npm run start:frontend`.

To get the backend running, you can run `npm run docker:backend`

## Current Games

* Tic Tac Toe

## Future Games

* Connect Four
* Checkers
* Chess

## Future Work

* Stateless game AIs are a good fit for AWS Lambda (or similar). Get this code working there.