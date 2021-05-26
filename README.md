## Gists Viewer

**Author: Riley Lundquist**

While working on this project, I focused my time on the GraphQL setup. The React app came later and was incomplete in the suggested time. I briefly revisited to make it more usable.

On the evening of 5/25, I worked on the Gists API wrapper, database setup, and GraphQL API for about 2 hours and got a bit of a start on the UI. After that, I spent a bit more time getting some semblance of a UI in place and making a couple necessary API tweaks.

The following morning, 5/26, I spent about 40 minutes getting the UI in a more usable state. If you're interested in the initial effort before this, feel free to reset to `2ad64a18`, but using the complete version will be more interesting.

---

### Overview

#### Gists API Wrapper

**/gists/index.js**
For the sake of time and simplicity, I kept the API library to a single file containing wrappers for the necessary calls for the current state of this project. It would be good to break it up into separate files per concern or endpoint if it were to expand.

I did not focus on a high level of detail or any kind of advanced error handling here, but the necessary calls get their respective jobs done.

#### GraphQL API

**/api/**
I focused most of my time on the GraphQL API portion of the project.

The API is set up using Apollo Federation, putting together a service for fetching gists from GitHub and one for adding/updating favorites in a local database.

See code comments for detail on assumptions/concessions.

#### React App

**/pages/**
The frontend is a Next.js app. It contains a homepage (/index) that lists the user's favorited gists and has a search bar for searching for gists by username. When a username is entered, the user is taken to a new page listing that user's gists (/user-gists/[username]). From either of these lists, clicking on a gist's description takes the user to a gist detail page (/gist-detail/[gist-id]), which, in addition to the other info, lists the gist's files. Gists can be favorited/unfavorited from all of these components.

**A couple notes:**

- I did not spend time working on elegant UX or error handling here (e.g. smooth refetching, redirects, empty states, usernames that don't exist, helpful error messages). At this point, this really just tests the happy paths of the API.
- Leveraging Urql's [Graphcache](https://formidable.com/open-source/urql/docs/graphcache/) would also provide some better UX here and help mitigate the rate-limiting problems, but I didn't have time to get into that.

---

### Running

`yarn (or npm) install`

**/scripts/db-setup.js** contains a basic script to get a local database going to handle this project. It assumes the user has postgres installed and running on port 5432 and there exists a role "gists" whose password is "gists", and we will write to a database named "gists". This is admittedly a bit irritating and restrictive, but it turns out my postgres is wonky on this machine, and I wanted to focus on the project.

Anyhow, if the above assumptions are met, running `node scripts/db-setup.js` will get the table set up.

**Starting the server:**
The server processes use **nodemon** and **foreman**. If you do not have them installed, run:
`npm i -g nodemon node-foreman`

then:
`nf start`

You should see 3 processes boot, a GraphQL server for GitHub Gists, one for local favorited Gists, and an Apollo Federation Gateway to make them play nicely together.

**Starting the web app:**
In a separate terminal from your server:
`yarn dev` || `npm run dev`
