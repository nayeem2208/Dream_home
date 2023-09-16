import React from "react";
import {FaInstagram,FaFacebook,FaWhatsapp,FaLinkedin} from 'react-icons/fa'

function Footer() {
  return (
    <div>
      <footer className="footer-area section-gap bg-footerColor bottom-0 ">
        <div className=" mx-auto">
          <div >
            <div className="w-full ">
              <div className="single-footer-widget">
                <h6 className="text-white p-3  text-center">About Us</h6>
                <p className="text-white   pb-7 text-center">
                  Dream Home is your ultimate destination for accessing a wide
                  range of professional services tailored to your specific
                  needs. We cater to a diverse clientele, including business
                  owners, entrepreneurs, and individuals seeking expert services
                  in various domains.
                </p>
              </div>
            </div>
            
          
            <div className="w-full">
              <div className="single-footer-widget">
                
                <p className="text-white text-center">Let us be social</p>
                <div className="footer-social flex items-center pb-12 justify-center">
                <FaInstagram className="text-white m-2 " size={24}/>
                <FaFacebook className="text-white m-2" size={24}/>
                <FaWhatsapp className="text-white m-2" size={24}/>
                <FaLinkedin className="text-white m-2 " size={24}/>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom flex justify-center items-center flex-wrap"></div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
