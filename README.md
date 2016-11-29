# data-gang

## User stories
**As** a member of the current FAC cohort,  
**I want to** find the best resource by topic,  
**so that** I can extend my learning each week.

**As** a member of the current FAC cohort,  
**I want to** share and review resources with my fellow FACers,  
**so that** we can learn collaboratively.

## Schema
[Here](./resources/database-schema.png)

## Project Milestones
Click [here](./milestones.md) for our Project plan

## Endpoints
**'/'** landing page displaying topics  
**'/{topicsEndpoint}'** resources by topic  
**'/{topicsEndpoint}/{resourceEndpoint}'** all reviews on specific resource  
**'/recent'** shows all reviews, by all users, in time order - most recent review first  
**'/users/{Username}'** all reviews written by this user  
**'/createResource'** form for user to add new resource  
**'/createReview/{resourceEndpoint}'** form for user to add their review  
**'/editResource'**  
**'/editReview'**  
**'/login'**  
**'/logout'**  

## Features:
- I can log in.
- I can see a list of recent reviews.
- I can see a list of reviewed resources.
- I can create, edit and view my own reviews.
- I can see a list of reviews of a particular resource.
- I can click on a listed review to read it.
- (optional extra) I can see a list of reviews by a particular user.
