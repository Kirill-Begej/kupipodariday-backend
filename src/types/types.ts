export interface IUser {
  id: number;
  username: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  about: string;
  avatar: string;
  password?: string;
}

interface IOffers {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  hidden: boolean;
}

interface IWish {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  link: string;
  image: string;
  price: number;
  raised: number;
  copied: number;
  description: string;
}

interface IWishlist {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  image: string;
}

export interface IWishAndOwner extends IWish {
  owner: IUser;
}

export interface IWishAndOwnerAndOffers extends IWish {
  owner: IUser;
  offers: IOffers[];
}

interface IWishlistAndOwnerAndItem extends IWishlist {
  owner: IUser;
  items: IWish[];
}

interface IUserAndWishesAndOffersAndWishlists extends IUser {
  wishes: IWishAndOwnerAndOffers[];
  offers: IOffers[];
  wishlists: IWishlistAndOwnerAndItem[];
}

export interface IOffersAndItemAndUser extends IOffers {
  item: IWishAndOwnerAndOffers;
  user: IUserAndWishesAndOffersAndWishlists;
}

export interface IWishFindByUsername extends IWish {
  offers: IOffersAndItemAndUser[];
}

export interface IWishlistAndOwnerAndItems extends IWishlist {
  owner: IUser;
  items: IWish[];
}
