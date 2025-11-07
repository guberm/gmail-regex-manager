# Gmail Regex Rules - Example Rules Library

## Common Use Cases

### 1. Newsletter Management

**Auto-label and archive newsletters:**
```
Name: Newsletter Filter
From Pattern: .*(newsletter|digest|update).*@.*
Actions: 
  - Add Label: "Newsletters"
  - Mark as Read
  - Archive
```

### 2. Social Media Notifications

**Filter Facebook notifications:**
```
Name: Facebook Notifications
From Pattern: .*@(facebookmail\.com|facebook\.com)
Subject Pattern: .*(notification|tagged|commented).*
Actions:
  - Add Label: "Social/Facebook"
  - Archive
```

**Filter LinkedIn notifications:**
```
Name: LinkedIn Notifications
From Pattern: .*@linkedin\.com
Actions:
  - Add Label: "Social/LinkedIn"
  - Archive
```

### 3. E-commerce & Shopping

**Track order confirmations:**
```
Name: Order Confirmations
Subject Pattern: .*(order|purchase|confirmation|receipt).*
Body Pattern: .*(order number|order #|tracking).*
Actions:
  - Add Label: "Shopping/Orders"
  - Star
```

**Deal alerts:**
```
Name: Deal Alerts
Subject Pattern: .*(sale|discount|offer|deal|\d+% off).*
Actions:
  - Add Label: "Shopping/Deals"
```

### 4. Work & Business

**Urgent emails:**
```
Name: Urgent Marker
Subject Pattern: ^\[URGENT\]|^URGENT:|.*\bURGENT\b.*
Actions:
  - Add Label: "!Urgent"
  - Mark as Important
  - Star
```

**Meeting invites:**
```
Name: Meeting Invites
Subject Pattern: .*(invitation|meeting|calendar).*
Body Pattern: .*(join|zoom|teams|meet\.google).*
Actions:
  - Add Label: "Meetings"
  - Mark as Important
```

**Invoice tracking:**
```
Name: Invoice Tracker
Subject Pattern: .*(invoice|bill|payment due).*
From Pattern: .*@(accounting|billing|finance).*
Actions:
  - Add Label: "Finance/Invoices"
  - Mark as Important
```

### 5. Development & GitHub

**GitHub notifications:**
```
Name: GitHub Notifications
From Pattern: notifications@github\.com
Actions:
  - Add Label: "Dev/GitHub"
  - Archive
```

**Code review requests:**
```
Name: Code Reviews
From Pattern: notifications@github\.com
Subject Pattern: .*(review requested|pull request).*
Actions:
  - Add Label: "Dev/Reviews"
  - Mark as Important
```

**CI/CD Build notifications:**
```
Name: Build Notifications
From Pattern: .*(jenkins|circleci|travis|gitlab).*
Subject Pattern: .*(build|failed|passed|deploy).*
Actions:
  - Add Label: "Dev/CI-CD"
```

### 6. Marketing & Promotions

**Auto-archive promotions:**
```
Name: Promotions Filter
From Pattern: .*(marketing|promo|offers).*
Subject Pattern: .*(exclusive|limited time|save now).*
Actions:
  - Add Label: "Marketing"
  - Mark as Read
  - Archive
```

### 7. Personal Finance

**Bank alerts:**
```
Name: Bank Alerts
From Pattern: .*@(bank|chase|wellsfargo|bankofamerica)\.com
Subject Pattern: .*(alert|transaction|balance).*
Actions:
  - Add Label: "Finance/Alerts"
  - Mark as Important
```

**Credit card statements:**
```
Name: CC Statements
From Pattern: .*@.*card.*
Subject Pattern: .*(statement|payment due).*
Actions:
  - Add Label: "Finance/Statements"
  - Star
```

### 8. Travel

**Flight confirmations:**
```
Name: Flight Confirmations
Subject Pattern: .*(flight|booking|confirmation).*
Body Pattern: .*(airline|flight|departure|arrival).*
Actions:
  - Add Label: "Travel/Flights"
  - Star
  - Mark as Important
```

**Hotel bookings:**
```
Name: Hotel Bookings
From Pattern: .*(booking\.com|hotels\.com|airbnb|expedia).*
Actions:
  - Add Label: "Travel/Hotels"
  - Star
```

### 9. Subscriptions & Services

**Streaming services:**
```
Name: Streaming Services
From Pattern: .*(netflix|spotify|hulu|disney|prime).*
Subject Pattern: .*(subscription|payment|renewal).*
Actions:
  - Add Label: "Subscriptions"
```

**Utility bills:**
```
Name: Utility Bills
From Pattern: .*(utility|electric|gas|water|internet).*
Subject Pattern: .*(bill|statement|payment).*
Actions:
  - Add Label: "Bills/Utilities"
  - Mark as Important
```

### 10. Spam & Unwanted

**Auto-trash obvious spam:**
```
Name: Spam Catcher
Subject Pattern: .*(viagra|casino|lottery winner|nigerian prince).*
Actions:
  - Move to Trash
```

**Unsubscribe candidates:**
```
Name: Unsubscribe Tracker
Body Pattern: .*unsubscribe.*
Subject Pattern: .*(weekly digest|daily update).*
Actions:
  - Add Label: "To-Unsubscribe"
```

## Regex Pattern Cheatsheet

### Common Patterns

| Pattern | Matches | Example |
|---------|---------|---------|
| `.*` | Any characters | Matches everything |
| `^text` | Starts with "text" | `^[URGENT]` |
| `text$` | Ends with "text" | `.*\.pdf$` |
| `text1\|text2` | Either text1 or text2 | `invoice\|receipt` |
| `[0-9]` | Any digit | `Order #[0-9]+` |
| `\d` | Any digit | `\d{5}` (5 digits) |
| `\w` | Word character | `\w+@domain\.com` |
| `\.` | Literal dot | `example\.com` |
| `.*@domain\.com` | Any email from domain | Sales emails |
| `(urgent\|important)` | Group alternatives | Priority emails |

### Email-Specific Patterns

**Domain matching:**
- `.*@example\.com` - Exact domain
- `.*@.*example.*` - Contains "example"
- `.*@(domain1\|domain2)\.com` - Multiple domains

**Subject patterns:**
- `^\[.*\]` - Starts with brackets
- `.*(RE:\|FWD:).*` - Reply or forward
- `.*\d{4,}.*` - Contains 4+ digit number

**Common keywords:**
- `.*(invoice\|receipt\|payment).*` - Financial
- `.*(meeting\|schedule\|calendar).*` - Meetings
- `.*(urgent\|asap\|important).*` - Priority

## Tips for Creating Effective Rules

1. **Start Simple**: Begin with basic patterns and refine
2. **Test First**: Use the Test tab before enabling
3. **Case Insensitive**: All patterns ignore case by default
4. **Escape Special Chars**: Use `\` before `.` `*` `?` etc.
5. **Be Specific**: Too broad patterns may catch unwanted emails
6. **Layer Rules**: Create multiple specific rules vs one complex rule
7. **Monitor Results**: Check labeled emails to verify accuracy

## Rule Priority & Execution

- All matching rules are applied to an email
- Rules execute in the order they're listed
- Multiple labels can be added by different rules
- Last action wins for conflicting actions (e.g., archive vs keep in inbox)

## Performance Optimization

- Limit body pattern searches (slower)
- Use specific "From" patterns when possible
- Keep total rules under 100 for best performance
- Disable unused rules instead of deleting them

---

**Pro Tip**: Export these rules to a text file for backup (feature coming soon!)
