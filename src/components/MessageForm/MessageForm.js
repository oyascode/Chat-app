import React from 'react'
import './MessageForm.css'
import Attachment from '../svg/Attachment'

const MessageForm = ({ handleSubmit, text, setText, setImg }) => {
  return (
      <form className='message_form' onSubmit={handleSubmit}>
        <label htmlFor="img"><Attachment /></label>
        <input 
          onChange={event => setImg(event.target.files[0])}
          type="file" 
          id='img' 
          accept='image/*' 
          style={{display: "none"}} 
        />
        <div> 
          <input 
            type="text" 
            placeholder='Enter message' 
            value={text} 
            onChange={event => setText(event.target.value)}
          />
        </div>
        <div>
          <button className='btn'>Send</button>
        </div>
      </form>
  )
}

export default MessageForm