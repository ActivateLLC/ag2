#!/usr/bin/env python3
"""
Create an Email Spam Filter Workflow in n8n

This script provides instructions for creating a workflow that:
1. Connects to your email account
2. Scans for potential spam emails based on keywords and patterns
3. Moves identified spam to trash or a spam folder
"""

import webbrowser
import time
from datetime import datetime

# Configuration
N8N_URL = "http://localhost:5678"

# Generate a unique workflow name
workflow_name = f"Email Spam Filter - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

# Print instructions
print("\n" + "="*100)
print(f"EMAIL SPAM FILTER WORKFLOW CREATION INSTRUCTIONS")
print("="*100)
print(f"Create a new workflow named: {workflow_name}")
print("\nThis workflow will connect to your email account, scan for spam, and delete or move spam emails.")
print("\nFOLLOW THESE STEPS:")
print("\n1. CREATE TRIGGER NODE:")
print("   - Add a 'Schedule' node")
print("   - Set it to run every hour (or your preferred frequency)")
print("   - Name it 'Hourly Trigger'")
print("\n2. ADD EMAIL CONNECTION NODE:")
print("   - Add an 'IMAP' node")
print("   - Configure it with your email credentials:")
print("     - Host: Your email provider's IMAP server (e.g., imap.gmail.com)")
print("     - User: Your email address")
print("     - Password: Your email password or app password")
print("     - Port: 993 (standard IMAP SSL port)")
print("     - SSL/TLS: Enabled")
print("   - Set to fetch emails from 'INBOX'")
print("   - Limit to 20 emails per run (adjust as needed)")
print("   - Only fetch unread emails (optional)")
print("   - Name it 'Fetch Recent Emails'")
print("\n3. ADD SPAM DETECTION NODE:")
print("   - Add a 'Function' node")
print("   - Use this code to detect potential spam:")
print("""
// Spam detection function
return items.map(item => {
  const email = item.json;
  
  // Define spam indicators (customize these)
  const spamKeywords = [
    'urgent', 'winner', 'lottery', 'million dollars', 'prince', 
    'inheritance', 'bitcoin', 'investment opportunity', 'viagra',
    'enlargement', 'free money', 'casino', 'discount', 'cheap',
    'earn money', 'work from home', 'make money fast'
  ];
  
  const spamSenders = [
    'marketing@', 'noreply@', 'promotions@', 'newsletter@'
  ];
  
  // Check for spam indicators
  let spamScore = 0;
  let spamReasons = [];
  
  // Check subject for spam keywords
  const subject = email.subject || '';
  spamKeywords.forEach(keyword => {
    if (subject.toLowerCase().includes(keyword.toLowerCase())) {
      spamScore += 2;
      spamReasons.push(`Subject contains "${keyword}"`);
    }
  });
  
  // Check body for spam keywords
  const body = email.text || email.html || '';
  spamKeywords.forEach(keyword => {
    if (body.toLowerCase().includes(keyword.toLowerCase())) {
      spamScore += 1;
      spamReasons.push(`Body contains "${keyword}"`);
    }
  });
  
  // Check sender
  const from = email.from || '';
  spamSenders.forEach(sender => {
    if (from.toLowerCase().includes(sender.toLowerCase())) {
      spamScore += 1;
      spamReasons.push(`Sender matches "${sender}"`);
    }
  });
  
  // Add spam score and reasons to the email object
  email.spamScore = spamScore;
  email.spamReasons = spamReasons;
  email.isSpam = spamScore >= 3; // Threshold for spam classification
  
  return {
    json: email
  };
});
""")
print("   - Name it 'Detect Spam'")
print("\n4. ADD FILTER NODE:")
print("   - Add a 'Split In Batches' node")
print("   - Set 'Property to split on' to 'isSpam'")
print("   - Name it 'Filter Spam'")
print("\n5. ADD DELETE SPAM NODE:")
print("   - Add an 'IMAP' node connected to the 'true' output of the Filter")
print("   - Configure with the same email credentials")
print("   - Set Operation to 'Delete Email'")
print("   - Set 'Source Email ID' to 'id' from input")
print("   - Name it 'Delete Spam Emails'")
print("\n6. (OPTIONAL) ADD LOGGING NODE:")
print("   - Add a 'Function' node after 'Delete Spam Emails'")
print("   - Use this code to log deleted emails:")
print("""
// Log deleted spam emails
const deletedEmails = items.map(item => {
  const email = item.json;
  return {
    subject: email.subject,
    from: email.from,
    spamScore: email.spamScore,
    spamReasons: email.spamReasons.join(', ')
  };
});

// You could send this log via email or save to a database
return [{ json: { deletedSpamEmails: deletedEmails, count: deletedEmails.length } }];
""")
print("   - Name it 'Log Deleted Emails'")
print("\n7. SAVE AND ACTIVATE THE WORKFLOW")
print("   - Click the 'Save' button")
print("   - Toggle the 'Active' switch to enable the workflow")
print("\nNOTE: This workflow will run automatically according to your schedule. Make sure to test it carefully")
print("before letting it automatically delete emails. Consider modifying it to move emails to a spam folder")
print("instead of deleting them until you're confident in its accuracy.")
print("="*100 + "\n")

# Open the n8n UI in the default browser
print(f"Opening n8n UI at {N8N_URL}...")
webbrowser.open(N8N_URL)

print("Browser should be opening. If not, please manually navigate to:")
print(N8N_URL)
print("\nFollow the instructions above to create your email spam filter workflow.")
