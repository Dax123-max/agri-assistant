# 🚀 Quick Start Guide

## Get Started in 3 Steps

### Step 1: Navigate to Project
```bash
cd tiffin-service-bot
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Run the Application
```bash
npm run dev
```

## Access the Application

Open your browser and visit:

### 👤 Customer Interface
**URL**: http://localhost:3000

**What to do**:
1. You'll see a chat interface with a greeting from the bot
2. Type "yes" to start ordering
3. Answer the bot's questions:
   - Your name
   - Phone number
   - Delivery address
   - Meal type (Vegetarian/Non-Vegetarian/Vegan/Jain)
   - Quantity
   - Delivery time
   - Dietary preferences
   - Special instructions
4. Review your order
5. Type "yes" to confirm

### 👨‍🍳 Cook Dashboard
**URL**: http://localhost:3000/cook

**What you'll see**:
- All orders displayed as cards
- Real-time notifications when new orders arrive
- Order details including customer info, meal preferences, and delivery time
- Buttons to update order status:
  - "Start Preparing" (for new orders)
  - "Mark Delivered" (for orders being prepared)

## Sample Test Order

Try this sample order to test the system:

```
Bot: Would you like to order a tiffin today?
You: yes

Bot: What's your name?
You: Priya Sharma

Bot: What's your phone number?
You: 9876543210

Bot: Where should we deliver your tiffin?
You: 45 MG Road, Bangalore

Bot: What type of meal would you like?
You: Vegetarian

Bot: How many tiffins would you like to order?
You: 2

Bot: When would you like your tiffin delivered?
You: Lunch

Bot: Do you have any dietary preferences?
You: No onion, less spicy

Bot: Any special instructions?
You: Extra roti please

Bot: [Shows confirmation]
You: yes
```

## What Happens Next?

1. ✅ Order is saved to `data/orders.json`
2. 🔔 Cook dashboard shows notification
3. 🔊 Audio alert plays
4. 📋 Order card appears with all details
5. 👨‍🍳 Cook can update status

## Troubleshooting

### Port 3000 Already in Use?
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Orders Not Showing?
- Check browser console for errors (F12)
- Verify `data/orders.json` file exists
- Try refreshing the cook dashboard

### Build Errors?
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Features to Explore

- ✨ Try ordering multiple tiffins
- 🔄 Watch the cook dashboard auto-refresh
- 📱 Test on mobile devices (responsive design)
- 🎨 Notice the beautiful gradient UI
- 🔔 Listen for notification sounds
- 📊 Track order status changes

## Next Steps

- Read `README.md` for detailed documentation
- Check `DEMO.md` for comprehensive testing guide
- Review `PROJECT_SUMMARY.md` for technical details
- Open `public/demo.html` in browser for visual preview

## Need Help?

- Check the console for error messages
- Verify all dependencies are installed
- Make sure you're in the correct directory
- Ensure Node.js version is 18 or higher

---

**Enjoy your Tiffin Service AI Bot! 🍱**
