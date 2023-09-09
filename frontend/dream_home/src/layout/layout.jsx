import React from 'react'
import UserHeader from '../components/userHeader.jsx'
import Footer from '../components/footer.jsx'
import Routers from '../routes/Router.jsx'

function Layout() {
  return (
    <div>
      <UserHeader/>
      <Routers/>
      {/* <Footer/> */}
    </div>
  )
}

export default Layout
