const { Message,Users, Reaction } = require('../../models');
const {UserInputError, AuthenticationError, ForbiddenError} = require('apollo-server')
const {Op} = require('sequelize')
const { PubSub, withFilter } = require( 'graphql-subscriptions');

const pubsub = new PubSub()
module.exports = {
    Query: {
        getMessages: async (parent, {from}, {user})=>{
            try{
                if(!user) throw new AuthenticationError('unauthenticated')

                const otherUser = await Users.findOne({
                    where:{
                        username:from
                    }
                })

                if(!otherUser) throw new UserInputError('user was not found')
                    const usernames = [user.username, otherUser.username]
                const messages = await Message.findAll({
                    where:{
                        from: {[Op.in]: usernames},
                        to: {[Op.in]: usernames}
                    },
                    order: [['createdAt', 'DESC']],
                    include: [{model: Reaction, as:'reactions'}]
                })
                return messages
            }catch(err){
                console.log(err)
                throw err
            }
        }
    },
    Mutation: {
        sendMessage: async(parent, {to, content}, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Ya bitch fucker, ya dont exist')
                const recipient = await Users.findOne({where:{username:to}})
                if(!recipient){
                    throw new UserInputError('User not found')
                }else if(recipient.username === user.username){
                    throw new UserInputError('You can not message yourself')
                }
                if(content.trim() === '') throw new UserInputError('message can not be empty')

                const message = await Message.create({
                    from: user.username,
                    to,
                    content,
                })
            
                pubsub.publish('NEW_MESSAGE', {newMessage: message})
                return message
            }catch(err){
                console.log(err)
                throw err
            }
        },
        reactToMessage: async(_,{uuid,content},{user})=>{
            const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
            try{
                if(!reactions.includes(content)){
                    throw new UserInputError('invalid reaction')
                }
                const username = user ? user.username : ''
                user = await Users.findOne({where:{username}})
                if(!user) throw new AuthenticationError('unauthenticated')

                const message = await Message.findOne({where:{uuid}})
                if(!message) throw new UserInputError('message not found')
                
                if(message.from !== user.username && message.to !== user.username){
                    throw new ForbiddenError('unauthorized')
                }
                let reaction = await Reaction.findOne({
                    where:{
                    messageId: message.id, userId:user.id
                }})

                if(reaction){
                    reaction.content = content
                    await reaction.save()
                }else{
                    reaction = await Reaction.create({
                        messageId: message.id,
                        userId: user.id,
                        content
                    })
                }
                pubsub.publish('NEW_REACTION', {newReaction: reaction})

                return reaction
            }catch(err){
                throw err
            }
        }
    },
    Subscription: {
        newMessage:{ 
            subscribe: withFilter((_,__,{currentUser}) => {
                if(!currentUser) throw new AuthenticationError('unauthenticated')
                return pubsub.asyncIterator(['NEW_MESSAGE'])  
            },({newMessage}, _,{currentUser})=>{
                if(newMessage.to === currentUser.username || newMessage.from === currentUser.username){
                    return true
                }
                    return false
            })
    },
    newReaction: {
        subscribe: withFilter((_,__,{ currentUser})=> {
            if(!currentUser) throw new AuthenticationError('unauthenticated')
            return pubsub.asyncIterator('NEW_REACTION')
        },
         async({newReaction},_,{currentUser})=>{
            const message =  await newReaction.getMessage()
            console.log(newReaction.getMessage())
            if (message.from === currentUser.username || message.to === currentUser.username){
                return true
            }
            return true
        })
        
    }
}
  };