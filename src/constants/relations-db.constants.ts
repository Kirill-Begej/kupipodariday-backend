export const RELATIONS_WISHES_FIND = ['owner', 'offers'];

export const RELATIONS_WISH_FIND = ['owner', 'offers', 'offers.user'];

export const RELATIONS_WISHES_FIND_BY_USERNAME = [
  'owner',
  'offers',
  'offers.item',
  'offers.item.owner',
  'offers.item.offers',
  'offers.user',
  'offers.user.wishes',
  'offers.user.wishes.owner',
  'offers.user.wishes.offers',
  'offers.user.offers',
  'offers.user.wishlists',
  'offers.user.wishlists.owner',
  'offers.user.wishlists.items',
];

export const RELATIONS_OFFERS_FIND = [
  'item',
  'item.owner',
  'item.offers',
  'user',
  'user.wishes',
  'user.wishes.owner',
  'user.wishes.offers',
  'user.offers',
  'user.wishlists',
  'user.wishlists.owner',
  'user.wishlists.items',
];

export const RELATIONS_WISHLIST_FIND = ['owner', 'items'];
