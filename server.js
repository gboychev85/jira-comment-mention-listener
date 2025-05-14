// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/jira-comment-listener', (req, res) => {
  const payload = req.body;
  console.log('✅ Webhook received');
  console.log(JSON.stringify(payload, null, 2));

  const issueKey = payload.issue?.key;
  const projectKey = payload.issue?.fields?.project?.key;
  const commentBody = payload.comment?.body || '';

  const mentionedUsers = commentBody.match(/@([a-zA-Z0-9._-]+)/g) || [];

  console.log(`🧾 Issue: ${issueKey}`);
  console.log(`📁 Project: ${projectKey}`);
  console.log(`💬 Comment: ${commentBody}`);
  console.log(`👥 Mentions: ${mentionedUsers.join(', ') || 'None'}`);

  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
