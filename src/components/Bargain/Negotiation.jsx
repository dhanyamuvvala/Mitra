import React, { useState } from 'react'

const Negotiation = ({ initialOffer = 100 }) => {
  const [messages, setMessages] = useState([
    { sender: 'supplier', text: `Current price: ₹${initialOffer}` }
  ])

  // Update messages when initialOffer changes
  React.useEffect(() => {
    setMessages([{ sender: 'supplier', text: `Current price: ₹${initialOffer}` }])
  }, [initialOffer])
  const [input, setInput] = useState('')

  const sendMessage = (text, sender) => {
    setMessages([...messages, { sender, text }])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input, 'vendor')
    setInput('')
    // Simulate supplier response
    setTimeout(() => {
      sendMessage('Let me consider your offer.', 'supplier')
    }, 1000)
  }

  return (
    <div className="card space-y-4">
      <h4 className="font-bold">Bargain/Negotiate</h4>
      <div className="h-40 overflow-y-auto bg-gray-50 p-2 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'vendor' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-1 rounded ${msg.sender === 'vendor' ? 'bg-primary-100' : 'bg-gray-200'}`}>
              <b>{msg.sender === 'vendor' ? 'You' : 'Supplier'}:</b> {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="input-field flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your offer or message..."
        />
        <button className="btn-primary" type="submit">Send</button>
      </form>
    </div>
  )
}

export default Negotiation 