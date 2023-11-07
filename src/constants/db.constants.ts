export const SELECT_USER_NOT_EMAIL_NOT_PASSWORD = {
  id: true,
  username: true,
  about: true,
  avatar: true,
  email: false,
  password: false,
  createdAt: true,
  updatedAt: true,
};

const SELECT_USER_NOT_PASSWORD = {
  id: true,
  username: true,
  about: true,
  avatar: true,
  email: true,
  password: false,
  createdAt: true,
  updatedAt: true,
};

export const SELECT_OWNER_NOT_DATA = {
  id: false,
  username: false,
  about: false,
  avatar: false,
  email: false,
  password: false,
  createdAt: false,
  updatedAt: false,
};

export const SELECT_OFFER = {
  user: {
    ...SELECT_USER_NOT_PASSWORD,
    wishlists: {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      image: true,
      owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
    },
  },
};

export const SELECT_FIND_WISH = {
  owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
  offers: {
    id: true,
    createdAt: true,
    updatedAt: true,
    amount: true,
    hidden: true,
    user: SELECT_USER_NOT_PASSWORD,
  },
};

export const SELECT_COPY_WISH = {
  id: true,
  name: true,
  link: true,
  image: true,
  price: true,
  description: true,
  copied: true,
  owner: {
    id: true,
  },
};

export const RELATIONS_FIND_OFFERS = [
  'user',
  'user.wishes',
  'user.offers',
  'user.wishlists',
  'user.wishlists.owner',
  'user.wishlists.items',
];
