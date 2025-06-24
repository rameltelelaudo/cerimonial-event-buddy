
export interface GiftList {
  id: string;
  eventId: string;
  userId: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftItem {
  id: string;
  giftListId: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  quantity: number;
  purchasedQuantity: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftSelection {
  id: string;
  giftItemId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  quantity: number;
  message?: string;
  selectedAt: Date;
}

export interface GiftItemWithSelections extends GiftItem {
  selections: GiftSelection[];
  availableQuantity: number;
}

export interface GiftListWithItems extends GiftList {
  items: GiftItemWithSelections[];
  totalItems: number;
  selectedItems: number;
}
