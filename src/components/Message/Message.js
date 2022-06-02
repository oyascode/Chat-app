import React, { useRef, useEffect } from 'react'
import './Message.css'
import Moment from 'react-moment'

const Message = ({ message, user1}) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }, [message])
  return (
    <div className={`message_wrap ${message.from === user1 ? "own" : ""}`} ref={scrollRef}>
      <p className={message.from === user1 ? "me" : "friend"}>
        { message.media ? <img src={message.media} alt="message.text" /> : null}
        {message.text}
        <br />  
        <small>
          <Moment fromNow>{message.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  )
}

export default Message