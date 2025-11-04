import { ConversationStep } from './types';

export class TiffinBot {
  private currentStep: ConversationStep = 'greeting';
  private orderData: Record<string, string> = {};

  getGreeting(): string {
    return "Hello! 👋 Welcome to our Tiffin Service! I'm here to help you place your order. Would you like to order a tiffin today?";
  }

  processResponse(userInput: string): { message: string; isComplete: boolean } {
    const input = userInput.toLowerCase().trim();

    switch (this.currentStep) {
      case 'greeting':
        if (input.includes('yes') || input.includes('sure') || input.includes('ok') || input.includes('yeah')) {
          this.currentStep = 'askName';
          return { message: "Great! Let's get started. What's your name?", isComplete: false };
        } else if (input.includes('no') || input.includes('not')) {
          return { message: "No problem! Feel free to come back when you're ready. Have a great day! 😊", isComplete: true };
        }
        return { message: "I didn't quite catch that. Would you like to order a tiffin? Please say 'yes' or 'no'.", isComplete: false };

      case 'askName':
        this.orderData.customerName = userInput;
        this.currentStep = 'askPhone';
        return { message: `Nice to meet you, ${userInput}! 😊 What's your phone number?`, isComplete: false };

      case 'askPhone':
        this.orderData.phoneNumber = userInput;
        this.currentStep = 'askAddress';
        return { message: "Perfect! Where should we deliver your tiffin? Please provide your complete address.", isComplete: false };

      case 'askAddress':
        this.orderData.address = userInput;
        this.currentStep = 'askMealType';
        return { 
          message: "Got it! What type of meal would you like?\n\n• Vegetarian\n• Non-Vegetarian\n• Vegan\n• Jain\n\nPlease choose one.", 
          isComplete: false 
        };

      case 'askMealType':
        this.orderData.mealType = userInput;
        this.currentStep = 'askQuantity';
        return { message: "Excellent choice! How many tiffins would you like to order?", isComplete: false };

      case 'askQuantity':
        this.orderData.quantity = userInput;
        this.currentStep = 'askDeliveryTime';
        return { 
          message: "When would you like your tiffin delivered?\n\n• Lunch (12:00 PM - 2:00 PM)\n• Dinner (7:00 PM - 9:00 PM)\n• Custom time\n\nPlease specify.", 
          isComplete: false 
        };

      case 'askDeliveryTime':
        this.orderData.deliveryTime = userInput;
        this.currentStep = 'askDietaryPreferences';
        return { message: "Do you have any dietary preferences or allergies we should know about? (e.g., no onion, no garlic, less spicy, etc.)", isComplete: false };

      case 'askDietaryPreferences':
        this.orderData.dietaryPreferences = userInput;
        this.currentStep = 'askSpecialInstructions';
        return { message: "Any special instructions for the cook? (e.g., extra roti, less oil, etc.)", isComplete: false };

      case 'askSpecialInstructions':
        this.orderData.specialInstructions = userInput;
        this.currentStep = 'confirmation';
        return { 
          message: this.getConfirmationMessage(), 
          isComplete: false 
        };

      case 'confirmation':
        if (input.includes('yes') || input.includes('confirm') || input.includes('correct')) {
          this.currentStep = 'complete';
          return { 
            message: "🎉 Perfect! Your order has been placed and sent to our cook. You'll receive your delicious tiffin on time. Thank you for choosing our service!", 
            isComplete: true 
          };
        } else {
          this.currentStep = 'greeting';
          this.orderData = {};
          return { message: "No problem! Let's start over. Would you like to place a new order?", isComplete: false };
        }

      default:
        return { message: "I'm not sure how to help with that. Let's start fresh!", isComplete: false };
    }
  }

  private getConfirmationMessage(): string {
    return `Let me confirm your order:\n\n` +
      `👤 Name: ${this.orderData.customerName}\n` +
      `📞 Phone: ${this.orderData.phoneNumber}\n` +
      `📍 Address: ${this.orderData.address}\n` +
      `🍽️ Meal Type: ${this.orderData.mealType}\n` +
      `🔢 Quantity: ${this.orderData.quantity}\n` +
      `⏰ Delivery Time: ${this.orderData.deliveryTime}\n` +
      `🥗 Dietary Preferences: ${this.orderData.dietaryPreferences}\n` +
      `📝 Special Instructions: ${this.orderData.specialInstructions}\n\n` +
      `Is everything correct? Please reply 'yes' to confirm or 'no' to start over.`;
  }

  getOrderData() {
    return { ...this.orderData };
  }

  reset() {
    this.currentStep = 'greeting';
    this.orderData = {};
  }
}
