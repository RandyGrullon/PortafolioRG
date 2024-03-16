import React from 'react'
import Layout from './Layout'
import { TypeWritter } from './TypeWritter'
import Footer from '@/components/features/common/Footer'

const about = () => {
  return (
    <Layout className="h-screen overflow-hidden">
        <div>
        <TypeWritter />
          <Footer />
        </div>
    </Layout>
  )
}

export default about