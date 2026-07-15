T&B TECHNOLOGIES — AIRTABLE-CONNECTED WEBSITE

YOUR AIRTABLE CONFIGURATION
Base ID: appyfx9VGogMXGXNc
Table name: Inquiries

REQUIRED AIRTABLE FIELD NAMES
- Name
- Email
- Phone
- Company Size
- What process would you like to improve?
- Submitted (Created time field; the website does not send this field)

DEPLOY ON NETLIFY
1. Create an Airtable Personal Access Token.
2. Give it the data.records:write scope.
3. Limit the token's access to the T&B Technologies base.
4. Log in to Netlify and create a new site.
5. Upload this entire folder or connect its GitHub repository.
6. In Netlify, open:
   Project configuration > Environment variables
7. Add:
   AIRTABLE_TOKEN = your private Airtable token
   AIRTABLE_BASE_ID = appyfx9VGogMXGXNc
   AIRTABLE_TABLE_NAME = Inquiries
8. Redeploy the site after adding the variables.
9. Submit one test inquiry and confirm that it appears in Airtable.

IMPORTANT
- Never add the real AIRTABLE_TOKEN to script.js, HTML, GitHub, or netlify.toml.
- The token belongs only in Netlify's environment-variable settings.
- The contact form will not submit successfully by opening contact.html directly from your computer.
  It must be run through Netlify or Netlify Dev because it uses a serverless function.

LOCAL TESTING
1. Install Node.js.
2. Run: npm install -g netlify-cli
3. Copy .env.example to .env and add your token.
4. Run: netlify dev
5. Open the local URL Netlify provides.
