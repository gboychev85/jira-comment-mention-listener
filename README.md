# Jira Webhook Comment Mention Listener

Listens to Jira webhook events, extracts mentions in comments, and logs the result.

## Endpoint

POST `/jira-comment-listener`

## Setup

```bash
npm install
node server.js
```

## Deployment

You can deploy this using Render, Railway, or any Node.js hosting platform.

Make sure to point your Jira Webhook URL to:

```
https://your-deployment-url.com/jira-comment-listener
```
