# ParkShare Testing Guide

## Prerequisites

1. **MongoDB**: Ensure MongoDB is running (local or Atlas)
2. **Environment Variables**: Create `.env` file in `apps/server/` based on `.env.example`

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `apps/server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parkshare
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### 3. Seed the Database

```bash
npm run seed --workspace apps/server
```

This will:
- Create default platform settings (15% commission, $0.99 booking fee)
- Create a global base pricing rule ($5/hour)

### 4. Start Development Servers

```bash
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:3000

Or start individually:
```bash
npm run dev:server   # Backend only
npm run dev:admin    # Frontend only
```

## Manual Testing

### 1. Platform Settings

1. Open http://localhost:3000
2. Click "Edit Settings" in Platform Settings card
3. Modify commission percentage (0-100)
4. Modify booking fee (dollars, e.g., 0.99)
5. Click "Save Changes"
6. Verify values update in the card

### 2. Pricing Rules - Create

1. Click "Add Pricing Rule" button
2. Fill in:
   - **Name**: "Downtown NYC"
   - **Description**: "Higher pricing for downtown Manhattan"
   - **Scope**: Select "city"
   - **Base Rate**: 10
   - **Priority**: 50
   - **Cities**: "Manhattan, Brooklyn"
3. Click "Create Rule"
4. Verify rule appears in list with:
   - Active badge
   - Correct scope badge
   - Base rate and priority displayed
   - City badges visible

### 3. Pricing Rules - Edit

1. Click pencil icon on existing rule
2. Modify:
   - Change base rate to 12
   - Add postal code prefix: "100"
3. Click "Update Rule"
4. Verify changes are reflected

### 4. Pricing Rules - Toggle Active

1. Edit a rule
2. Toggle "Active" switch off
3. Save
4. Verify badge changes from "Active" to "Inactive"

### 5. Pricing Rules - Delete

1. Click trash icon on a rule
2. Verify rule disappears from list

### 6. API Testing with curl

**Get Platform Settings:**
```bash
curl http://localhost:5000/api/admin/pricing/settings
```

**Update Platform Settings:**
```bash
curl -X PUT http://localhost:5000/api/admin/pricing/settings \
  -H "Content-Type: application/json" \
  -d '{"providerCommissionPercentage": 20, "platformBookingFee": 150}'
```

**Get Pricing Rules:**
```bash
curl http://localhost:5000/api/admin/pricing/rules
```

**Create Pricing Rule:**
```bash
curl -X POST http://localhost:5000/api/admin/pricing/rules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SF Downtown",
    "scope": "city",
    "baseRate": 8,
    "priority": 60,
    "isActive": true,
    "conditions": {
      "cities": ["San Francisco"]
    }
  }'
```

**Calculate Price Quote:**
```bash
curl -X POST http://localhost:5000/api/pricing/quote \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Manhattan",
    "postalCode": "10001",
    "listingType": "garage",
    "features": ["EV Charging"],
    "durationHours": 3
  }'
```

Expected response:
```json
{
  "baseRatePerHour": 10,
  "durationHours": 3,
  "baseCost": 30,
  "adjustments": [],
  "adjustedBaseCost": 30,
  "providerCommissionPercentage": 15,
  "providerEarnings": 25.5,
  "platformBookingFee": 0.99,
  "ownerTotal": 30.99
}
```

## Test Scenarios

### Scenario 1: Multiple Rules Priority

1. Create Rule A: Global, Priority 100, $5/hr
2. Create Rule B: City="NYC", Priority 50, $10/hr
3. Create Rule C: Postal="100", Priority 30, $15/hr
4. Test quote for NYC with postal 100XX
   - Should use Rule C ($15/hr) due to lowest priority number

### Scenario 2: Adjustments

1. Create Rule with adjustments:
```json
{
  "name": "Garage Premium",
  "scope": "listingType",
  "baseRate": 5,
  "conditions": {
    "listingTypes": ["garage"]
  },
  "adjustments": [
    {
      "label": "Covered Parking",
      "type": "percentage",
      "amount": 10
    }
  ]
}
```

2. Test quote with listingType="garage", duration=2
   - Base: $10 (5 × 2)
   - After adjustment: $11 (10% increase)

### Scenario 3: Inactive Rules

1. Create Rule: City="NYC", Priority 10, $20/hr, Active
2. Create Rule: Global, Priority 100, $5/hr, Active
3. Test quote for NYC → $20/hr
4. Deactivate NYC rule
5. Test quote for NYC → $5/hr (falls back to global)

## Edge Cases

1. **No pricing rules**: Should return error
2. **Invalid commission (>100)**: Should return validation error
3. **Negative base rate**: Should return validation error
4. **Empty rule name**: Should return validation error
5. **Delete last active global rule**: Should prevent or warn

## Success Criteria

✅ Platform settings can be read and updated
✅ Pricing rules can be created, read, updated, and deleted
✅ Priority system works correctly (lower = higher priority)
✅ Scope matching works (global, city, postalCodePrefix, etc.)
✅ Adjustments are applied correctly
✅ Inactive rules are not used in calculations
✅ UI updates reflect backend changes immediately (React Query)
✅ Dark mode styling is consistent
✅ Forms validate input correctly
✅ Error messages are clear and helpful

## MongoDB Direct Access

Connect to MongoDB:
```bash
mongosh mongodb://localhost:27017/parkshare
```

View collections:
```javascript
show collections

db.platformsettings.find().pretty()
db.pricingrules.find().pretty()
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Test connection: `mongosh mongodb://localhost:27017`

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules apps/*/node_modules
npm install
```

### TypeScript Errors
```bash
# Check TypeScript
npm run build --workspace apps/server
npm run build --workspace apps/admin
```
