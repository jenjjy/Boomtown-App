const { ApolloError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const authMutations = require('./auth');
const { UploadScalar, DateScalar } = require('../custom-types');

module.exports = app => {
  return {
    // Upload: UploadScalar,
    Date: DateScalar,

    Query: {
      viewer(parent, args, { token }) {
        if (token) {
          return jwt.decode(token, app.get('JWT_SECRET'));
        }
        return null;
      },
      async user(parent, { id }, { pgResource }, info) {
        try {
          const user = await pgResource.getUserById(id);
          return user;
        } catch (e) {
          throw new ApolloError(e);
        }
      },
      async items(parent, { filter }, { pgResource }) {
        try {
          const items = await pgResource.getItems(filter);
          return items;
        } catch (e) {
          throw new ApolloError(e);
        }
      },
      async tags(parent, args, { pgResource }) {
        try {
          const tags = await pgResource.getTags();
          return tags;
        } catch (e) {
          throw new ApolloError(e);
        }
      }
    },

    User: {
      async items(user, args, { pgResource }) {
        try {
          const userItems = await pgResource.getItemsForUser(user.id);
          return userItems;
        } catch (e) {
          throw new ApolloError(e);
        }
      },
      async borrowed(user, args, { pgResource }) {
        try {
          const userBorrowed = await pgResource.getBorrowedItemsForUser(
            user.id
          );
          return userBorrowed;
        } catch (e) {
          throw new ApolloError(e);
        }
      }
    },

    Item: {
      async itemowner(item, args, { pgResource }) {
        try {
          const itemOwner = await pgResource.getUserById(item.ownerid);

          return itemOwner;
        } catch (e) {
          throw new ApolloError(e);
        }
      },
      async tags(item, args, { pgResource }) {
        try {
          const itemTags = await pgResource.getTagsForItem(item.id);
          return itemTags;
        } catch (e) {
          throw new ApolloError(e);
        }
      },
      async borrower(item, args, { pgResource }) {
        if (!item.borrowerid) return null;
        try {
          const itemBorrower = await pgResource.getUserById(item.borrowerid);
          return itemBorrower;
        } catch (e) {
          throw new ApolloError(e);
        }
      },
      async imageurl({ imageurl, imageid, mimetype, data }) {
        if (imageurl) return imageurl;
        if (imageid) {
          return `data:${mimetype};base64, ${data}`;
        }
      }
    },

    Mutation: {
      ...authMutations(app),

      async addItem(parent, args, context, info) {
        // const image = await image;
        try {
          const user = await jwt.decode(context.token, app.get('JWT_SECRET'));
          const newItem = await context.pgResource.saveNewItem({
            item: args.item,
            user // image: args.image,
          });
          return newItem;
        } catch (e) {
          throw new ApolloError(e);
        }
      },
      async borrow(parent, args, context, info) {
        try {
          const user = await jwt.decode(context.token, app.get('JWT_SECRET'));
          const borrowItem = await context.pgResource.getItemById({
            item: args.item,
            user
          });
          return borrowItem;
        } catch (e) {
          throw new ApolloError(e);
        }
      }
    }
  };
};
