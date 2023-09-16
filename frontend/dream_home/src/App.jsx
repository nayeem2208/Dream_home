import "./App.css";
import Layout from "./layout/layout.jsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <>
     <ToastContainer/>
      <Layout/>
    </>
  );
}

export default App;
