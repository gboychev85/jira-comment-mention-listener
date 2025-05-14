const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const JIRA_BASE_URL = 'https://your-jira-server.com'; // change this
const JIRA_USER = 'admin'; // Jira user with issue edit access
const JIRA_API_TOKEN = 'your_admin_password_or_token'; // For Jira Server, use password or token

const AUTH = {
  auth: {
    username: JIRA_USER,
    password: JIRA_API_TOKEN
  }
};

const CUSTOM_FIELD_ID = 'customfield_12345'; // Replace with your actual field ID

app.post('/jira-comment-listener', async (req, res) => {
  const payload = req.body;
  const issueKey = payload.issue?.key;
  const commentBody = payload.comment?.body || '';

  const mentionedUsers = commentBody.match(/@([a-zA-Z0-9._-]+)|\[~([a-zA-Z0-9._-]+)\]/g) || [];
  const cleanedMentions = mentionedUsers.map(m => m.replace(/^@|\[~|\]$/g, ''));

  if (cleanedMentions.length === 0) return res.status(200).send('No mentions');

  try {
    const issueUrl = `${JIRA_BASE_URL}/rest/api/2/issue/${issueKey}`;
    const issueRes = await axios.get(issueUrl, AUTH);

    const currentUsers = issueRes.data.fields[CUSTOM_FIELD_ID] || [];
    const currentUsernames = currentUsers.map(user => user.name);

    const newUsers = cleanedMentions.filter(u => !currentUsernames.includes(u));
    if (newUsers.length === 0) return res.status(200).send('No new users to add');

    const updatedUsers = [...currentUsernames, ...newUsers].map(username => ({ name: username }));

    await axios.put(issueUrl, {
      fields: {
        [CUSTOM_FIELD_ID]: updatedUsers
      }
    }, AUTH);

    console.log(`✅ Updated ${issueKey}, added: ${newUsers.join(', ')}`);
    res.status(200).send('Updated');
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
    res.status(500).send('Failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
