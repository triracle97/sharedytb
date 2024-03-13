# Getting started

### How to run this project locally

Add this to .env in root directory:

```shell
MONGODB_URI=mongodb://127.0.0.1:27017/shareytb
NEXTAUTH_SECRET=thisisasecret
NEXT_PUBLIC_PUSH_SERVER_HOST=127.0.0.1
```

Start docker service first, and then run

```shell
yarn install
yarn bundle
```

To clear container, run:

```shell
docker compose down
```

### How to use

- Login in the top right corner. Email is not actually email (I don't validate it, so it can be any string)
- After logging in, you can press add to add video, a new page will be opened with an input and a button, add youtube link for example https://www.youtube.com/watch?v=7NUpMNLRlDA&ab_channel=TheHanoiChamomile to the input and press add button then you will be navigated back to home page.
- To test websocket, can start another window and open home page.

Then access http://localhost:3000

### Some notes for this project:

- I don't validate anything.
- UI is very simple/
- I only write test for important components (I'm not familiar with frontend testing)
- The testcases are handled a bit tricky, need to run in right order to work, in real production need to handle the test env cleaner
- For simplicity, I didn't bundle this to a docker container (because nextjs can easily be run on serverless services)