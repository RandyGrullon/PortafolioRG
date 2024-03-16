import React from 'react'
import Layout from './Layout'
import { ContactMeForm } from '@/components/features/ui-components/ContactMeForm'

const ContactMe = () => {
  return(
    <Layout className="h-screen overflow-hidden">
       <ContactMeForm />
    </Layout>
  )
}

export default ContactMe