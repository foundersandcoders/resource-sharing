# Milestone planning

## Tuesday
### Morning
Choose Idea
User stories
Wireframing
Features
Schema

### Afternoon
Get environment set up:
File structure
Install dependencies - hapi, handlebars, pg
Initialise database

## Wednesday
### Morning
Integrate index.js, db_build.js & db_build.sql - make sure `node index.js` works as expected
Create route & handler for '/' endpoint
Create helper function (queries.js) to use in handler

### Afternoon
Create route & handler for rest of endpoints (apart from login & logout):
- '/{topicsEndpoint}' resources by topic
- '/{topicsEndpoint}/{resourceEndpoint}' all reviews on specific resource
- '/recent' shows all reviews, by all users, in time order - most recent review first
- '/users/{Username}' all reviews written by this user
- '/createResource' form for user to add new resource
- '/createReview/{resourceEndpoint}' form for user to add their review
- '/editResource'
- '/editReview'

## Thursday
