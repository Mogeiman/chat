const userResolvers = require('./users');
const messageResolvers = require('./messages');
const { Subscription } = require('./messages');

const {Users, Message} = require('../../models')

module.exports = {
    Message: {
            createdAt: (parent) => parent.createdAt.toISOString()
        },
    Reaction: {
            createdAt: (parent) => parent.createdAt.toISOString(),
            message: async (parent) => await Message.findByPk(parent.messageId),
            user: async (parent) =>
            await Users.findByPk(parent.userId, {
                attributes: ['username', 'imageUrl', 'createdAt'],
            }),
        },
        
    User: {
            createdAt: (parent) => parent.createdAt.toISOString()
        },
    
    Query: {
        ...userResolvers.Query,
        ...messageResolvers.Query,
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation,
    },
    Subscription: {
        ...messageResolvers.Subscription
    }
}