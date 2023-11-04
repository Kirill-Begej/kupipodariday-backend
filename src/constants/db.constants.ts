export const SELECT_FIND_OFFER = {
  user: {
    id: true,
    username: true,
    about: true,
    avatar: true,
    email: true,
    password: false,
    createdAt: true,
    updateAt: true,
    wishlists: {
      id: true,
      createdAt: true,
      updateAt: true,
      name: true,
      image: true,
      owner: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: false,
        password: false,
        createdAt: true,
        updateAt: true,
      }
    }
  }, 
};