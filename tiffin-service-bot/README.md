# 🍱 Tiffin Service AI Bot

An intelligent chatbot application for managing tiffin (meal delivery) orders. The bot interacts with customers to collect order details and sends notifications to the cook with all the information.

## Features

### Customer Interface
- **Interactive AI Chatbot**: Conversational interface that guides customers through the ordering process
- **Order Collection**: Gathers all necessary information:
  - Customer name
  - Phone number
  - Delivery address
  - Meal type (Vegetarian, Non-Vegetarian, Vegan, Jain)
  - Quantity
  - Delivery time
  - Dietary preferences
  - Special instructions
- **Order Confirmation**: Reviews all details before placing the order
- **Beautiful UI**: Modern, responsive design with gradient colors

### Cook Dashboard
- **Real-time Order Display**: Shows all orders with complete details
- **Order Status Management**: Track orders through three stages:
  - 🆕 New
  - 👨‍🍳 Preparing
  - ✅ Delivered
- **Notifications**: Audio and visual alerts for new orders
- **Auto-refresh**: Automatically checks for new orders every 5 seconds
- **Order Cards**: Clean, organized display of all order information

## Technology Stack

- **Frontend**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: JSON file-based storage
- **API**: Next.js API Routes

## Getting Started

### Installation

```bash
cd tiffin-service-bot
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the customer chat interface.

Open [http://localhost:3000/cook](http://localhost:3000/cook) to access the cook dashboard.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## How It Works

1. **Customer Places Order**:
   - Customer visits the main page
   - AI bot greets and asks if they want to order
   - Bot collects all order details through conversation
   - Customer confirms the order
   - Order is saved and sent to cook

2. **Cook Receives Order**:
   - Cook dashboard automatically refreshes
   - New order notification appears with sound
   - Cook can see all order details
   - Cook updates order status as they prepare and deliver

3. **Order Tracking**:
   - Orders move through: New → Preparing → Delivered
   - All orders are stored in `data/orders.json`
   - Order history is maintained

## Project Structure

```
tiffin-service-bot/
├── app/
│   ├── api/
│   │   └── orders/
│   │       └── route.ts          # API endpoints for orders
│   ├── cook/
│   │   └── page.tsx              # Cook dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Customer chat interface
├── components/
│   └── ChatInterface.tsx         # Chat UI component
├── lib/
│   ├── chatbot.ts                # Chatbot logic
│   └── types.ts                  # TypeScript types
├── data/
│   └── orders.json               # Order storage (created automatically)
└── public/                       # Static assets
```

## API Endpoints

### GET /api/orders
Fetch all orders

### POST /api/orders
Create a new order

**Body:**
```json
{
  "customerName": "string",
  "phoneNumber": "string",
  "address": "string",
  "mealType": "string",
  "quantity": "number",
  "deliveryTime": "string",
  "dietaryPreferences": "string",
  "specialInstructions": "string"
}
```

### PATCH /api/orders
Update order status

**Body:**
```json
{
  "id": "string",
  "status": "new" | "preparing" | "delivered"
}
```

## Features Highlights

- ✅ Conversational AI for natural order collection
- ✅ Real-time notifications for cooks
- ✅ Order status tracking
- ✅ Responsive design for all devices
- ✅ Auto-refresh for new orders
- ✅ Audio notifications
- ✅ Beautiful gradient UI
- ✅ TypeScript for type safety
- ✅ File-based storage (no database required)

## Future Enhancements

- SMS/Email notifications
- Payment integration
- Order history for customers
- Analytics dashboard
- Multi-language support
- Customer authentication
- Rating and feedback system

## License

ISC
