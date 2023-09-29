
import { useSelector } from 'react-redux'
import {Navigate,Outlet} from 'react-router-dom'

function AdminPrivateRoute() {

    let {adminInfo}=useSelector((state)=>state.adminAuth)
  return (
    adminInfo? <Outlet/>:<Navigate to='/adminlogin' replace/>
  )
}

export default AdminPrivateRoute
