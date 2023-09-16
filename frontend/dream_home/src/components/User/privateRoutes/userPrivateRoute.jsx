import { Navigate,Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserPrivateRoute = () =>{
    const {userInfo} = useSelector((state)=>state.auth);
    return userInfo ? <Outlet/> : <Navigate to='/' replace />
};

export default UserPrivateRoute;