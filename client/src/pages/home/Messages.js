import React, { useEffect, useState } from 'react'
import { Col, Button, Form} from 'react-bootstrap'
import {gql, useQuery, useLazyQuery, useMutation} from '@apollo/client'
import { useMessageDispatch, useMessageState } from '../../context/Message'
import {FiSend} from 'react-icons/fi'
import Message from './Message'
const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
      reactions{
        uuid content
      }
    }
  }
`
const SEND_MESSAGE =gql`
    mutation sendMessage($to: String!, $content: String!){
      sendMessage(to:$to, content: $content){
        uuid from to content createdAt
      }
    }
`
export default function Messages() {
  const [content, setContent] = useState()
  const dispatch = useMessageDispatch()
  const {users} = useMessageState()
  const selectedUser = users?.find(u => u.selected === true)
  const messages = selectedUser?.messages


  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES)




  
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  })

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } })
    }
  }, [selectedUser])
  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      })
    }
  }, [messagesData])


  const submitMessage = (e) => {
    e.preventDefault()

    if (content.trim() === '' || !selectedUser) return

    setContent('')

    // mutation for sending the message
    sendMessage({ variables: { to: selectedUser.username, content } })
  }


    let selectedChatMarkup
    if(!messages && !messagesLoading){
      selectedChatMarkup = <p className='infoText'>Select a Friend</p>
    }else if(messagesLoading){
      selectedChatMarkup =  <p className='infoText'>Loading...</p>
    }else if(messages.length>0){
      selectedChatMarkup = messages.map((message, index)=>(
        <>
        <Message key={message.uuid} message={message}/>
        {index === messages.length-1&& (
          <div className='invisible'>
            <hr className='m-0' />
          </div>
        )}
        </>
       
      ))
    }else if(messages.length === 0){
      selectedChatMarkup =  <p>You are now connected!! send Your first Message</p>

    }


  return (
    <Col xs={10} md={8} className="p-0" >
      <div className="messages-box d-flex flex-column-reverse p-3">
        {selectedChatMarkup}
      </div>
      <div className='px-3 py-2'>
        <Form onSubmit={submitMessage}>
          <Form.Group className="d-flex align-items-center m-0">
            <Form.Control
              type="text"
              className="message-input rounded-pill p-4 bg-secondary border-0"
              placeholder="Type a message.."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <FiSend
              className="fas fa-paper-plane fa-2x text-primary me-2"
              onClick={submitMessage}
              role="button"
              size={40}
            />
          </Form.Group>
        </Form>
      </div>
      
    </Col>
    )
}
