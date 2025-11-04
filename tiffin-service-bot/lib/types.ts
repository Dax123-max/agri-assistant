export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  mealType: string;
  quantity: number;
  deliveryTime: string;
  dietaryPreferences: string;
  specialInstructions: string;
  timestamp: string;
  status: 'new' | 'preparing' | 'delivered';
}

export interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
}

export type ConversationStep = 
  | 'greeting'
  | 'askName'
  | 'askPhone'
  | 'askAddress'
  | 'askMealType'
  | 'askQuantity'
  | 'askDeliveryTime'
  | 'askDietaryPreferences'
  | 'askSpecialInstructions'
  | 'confirmation'
  | 'complete';
