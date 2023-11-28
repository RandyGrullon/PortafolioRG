// components/ContactMe.js
import React, { useState } from 'react';

const ContactMe = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar lógica para enviar el formulario
    console.log('Email:', email);
    console.log('Message:', message);
    // Reinicia los estados del formulario después de enviar
    setEmail('');
    setMessage('');
  };

  return (
    <section id="contact" className="pt-20  lg:h-screen md:h-screen  bg-gradient-to-r from-warm-300 via-warm-400 to-warm-500 text-white animate__animated animate__fadeIn flex flex-col justify-center items-center p-4">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold mb-6">Contact</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Your Email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Write here!"
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Send message</button>
        </form>
      </div>
       
    </section>
  );
};

export default ContactMe;
