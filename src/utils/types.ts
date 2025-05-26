export type TMenuItem = {
  itemId: string;
  name: string;
  category: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TBasketItem = TMenuItem & {
  basketId: string;
};

export type TPurchase = {
  purchaseId: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  orderNumber: number;
  items: string[];
};

export type TPurchaseData = {
  purchases: TPurchase[];
  total: number;
  todayTotal: number;
};

export type TAccount = {
  email: string;
  name: string;
};

export type TMenuCategory = 'bread' | 'sauce' | 'dish';