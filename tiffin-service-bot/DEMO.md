# 🍱 Tiffin Service AI Bot - Demo Guide

## Quick Start

To run the application:

```bash
cd tiffin-service-bot
npm run dev
```

Then open your browser to:
- **Customer Interface**: http://localhost:3000
- **Cook Dashboard**: http://localhost:3000/cook

## Demo Flow

### Step 1: Customer Places Order

1. Open http://localhost:3000
2. The AI bot will greet you: "Hello! 👋 Welcome to our Tiffin Service!"
3. Type "yes" to start ordering
4. Follow the conversation:
   - Enter your name (e.g., "John Doe")
   - Enter phone number (e.g., "9876543210")
   - Enter address (e.g., "123 Main Street, Apartment 4B")
   - Choose meal type (e.g., "Vegetarian")
   - Enter quantity (e.g., "2")
   - Choose delivery time (e.g., "Lunch")
   - Enter dietary preferences (e.g., "No onion, less spicy")
   - Enter special instructions (e.g., "Extra roti please")
5. Review the order summary
6. Type "yes" to confirm

### Step 2: Cook Receives Order

1. Open http://localhost:3000/cook in another tab/window
2. You'll see the new order appear automatically
3. The dashboard will show:
   - 🔔 Notification: "New order received!"
   - Audio beep sound
   - Order card with all details
4. Click "Start Preparing" to update status
5. Click "Mark Delivered" when done

## Features to Test

### Customer Chat Interface
- ✅ Conversational flow
- ✅ Input validation
- ✅ Order confirmation
- ✅ Beautiful gradient UI
- ✅ Responsive design
- ✅ Message timestamps
- ✅ Typing indicator

### Cook Dashboard
- ✅ Real-time order display
- ✅ Auto-refresh (every 5 seconds)
- ✅ Visual notifications
- ✅ Audio notifications
- ✅ Order status updates
- ✅ Order cards with complete details
- ✅ Status badges (New, Preparing, Delivered)
- ✅ Total order count

## Sample Test Data

### Test Order 1
- Name: Priya Sharma
- Phone: 9876543210
- Address: 45 MG Road, Bangalore
- Meal: Vegetarian
- Quantity: 1
- Time: Lunch
- Dietary: No onion, no garlic
- Instructions: Extra dal please

### Test Order 2
- Name: Rahul Kumar
- Phone: 9123456789
- Address: 78 Park Street, Kolkata
- Meal: Non-Vegetarian
- Quantity: 3
- Time: Dinner
- Dietary: Less spicy
- Instructions: Include chicken curry

### Test Order 3
- Name: Anjali Patel
- Phone: 9988776655
- Address: 12 Beach Road, Mumbai
- Meal: Vegan
- Quantity: 2
- Time: 1:00 PM
- Dietary: Gluten-free
- Instructions: No dairy products

## Testing Checklist

- [ ] Customer can start a conversation
- [ ] Bot asks all required questions
- [ ] Order data is collected correctly
- [ ] Confirmation shows all details
- [ ] Order is saved to database
- [ ] Cook dashboard displays order
- [ ] Notification appears for new orders
- [ ] Audio notification plays
- [ ] Status can be updated
- [ ] Multiple orders display correctly
- [ ] UI is responsive on mobile
- [ ] Auto-refresh works
- [ ] Navigation between pages works

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Orders Not Appearing
- Check if `data/orders.json` file is created
- Check browser console for errors
- Verify API endpoint is working: http://localhost:3000/api/orders

### Build Errors
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

## Architecture

```
Customer (Browser)
    ↓
Chat Interface (React Component)
    ↓
TiffinBot (Chatbot Logic)
    ↓
API Route (/api/orders)
    ↓
JSON File Storage (data/orders.json)
    ↑
Cook Dashboard (Auto-refresh)
    ↑
Cook (Browser)
```

## Next Steps

After testing, you can:
1. Customize the meal types
2. Add more dietary options
3. Integrate with SMS/Email services
4. Add payment gateway
5. Deploy to Vercel or other hosting
6. Add customer authentication
7. Create mobile app version
