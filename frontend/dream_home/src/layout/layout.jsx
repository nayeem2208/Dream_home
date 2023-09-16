import React from 'react'
import UserHeader from '../components/User/userHeader.jsx'
import Routers from '../routes/Router.jsx'
import { useLocation } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader.jsx'
import Footer from '../components/User/footer.jsx'

function Layout() {

  let location =useLocation()
  let adminHeader = location.pathname.startsWith('/admin')
  return (
    <div>
      {adminHeader?<AdminHeader/>:<UserHeader/>}
      <Routers/>
      
      {adminHeader?'':<Footer/>}
    </div>
  )
}

export default Layout
