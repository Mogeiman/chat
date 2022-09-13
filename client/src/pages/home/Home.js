import React,{useEffect} from 'react'
import {Row, Col, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'
import { useAuthDispatch, useAuthState } from '../../context/auth'
import { useMessageDispatch } from '../../context/Message'
import {GrLogout} from 'react-icons/gr'
import { gql,useSubscription } from '@apollo/client'
import Messages from './Messages'
import Users from './Users'


const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`
const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      message {
        uuid
        from
        to
      }
    }
  }
`
export default function Home() {
  const authDispatch = useAuthDispatch()
  const messageDispatch = useMessageDispatch()
  const {user} = useAuthState()


  const {data: messageData, error: messageError} = useSubscription(NEW_MESSAGE)
  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION
  )

  useEffect(() => {
    if (messageError) console.log(messageError)

    if (messageData) {
      const message = messageData.newMessage
      const otherUser = user.username === message.to ? message.from : message.to

      messageDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          username: otherUser,
          message,
        },
      })
    }
  }, [messageError, messageData])

  useEffect(() => {
    if (reactionError) console.log(reactionError)

    if (reactionData) {
      const reaction = reactionData.newReaction
      const otherUser =
        user.username === reaction.message.to
          ? reaction.message.from
          : reaction.message.to

      messageDispatch({
        type: 'ADD_REACTION',
        payload: {
          username: otherUser,
          reaction,
        },
      })
    }
  }, [reactionError, reactionData])

  
  const logout =()=>{
    authDispatch({ type: 'LOGOUT'})
    window.location.href='/login'
}
  return (
    <>
    <Row className=" bg-white mb-1">
     
      <Col className='content-row'>
      <OverlayTrigger
      placement={'left'}
      overlay={
        <Tooltip>
         <small>Logout</small>
        </Tooltip>
      }
      transition={false}
    >
         <Button variant="link" className=''onClick={logout}>
            <GrLogout size={20} color={'red'}/>
        </Button>
    </OverlayTrigger>
         
      </Col>
       
    </Row>
    <Row className='bg-white'>
      <Users />
      <Messages />
   
    </Row>
    </>
    
  )
}
