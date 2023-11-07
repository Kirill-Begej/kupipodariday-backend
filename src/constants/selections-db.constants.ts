const SELECT_USER_NOT_DATA = {
  id: false,
  username: false,
  about: false,
  avatar: false,
  email: false,
  password: false,
  createdAt: false,
  updatedAt: false,
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

const SELECT_OFFERS = {
  id: true,
  createdAt: true,
  updatedAt: true,
  amount: true,
  hidden: true,
};

const SELECT_WISHES = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  link: true,
  image: true,
  price: true,
  raised: true,
  copied: true,
  description: true,
};

const SELECT_WISHLISTS = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  image: true,
};

export const SELECT_WISHES_FIND_BY_USERNAME = {
  owner: SELECT_USER_NOT_DATA,
  offers: {
    ...SELECT_OFFERS,
    item: {
      ...SELECT_WISHES,
      owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
    },
    user: {
      ...SELECT_USER_NOT_PASSWORD,
      wishes: {
        ...SELECT_WISHES,
        owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
      },
      wishlists: {
        ...SELECT_WISHLISTS,
        owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
      },
    },
  },
};
