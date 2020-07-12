import React from 'react';
import { Container, Row } from 'twomj-components-react';
import { Link } from 'react-router-dom';


const Footer = () => {
   return (
      <footer className="footer pt-4">
         <Container className="w-100">
            <Row className="col-12 m-0">
               <div className="row col-12 justify-content-center p-0 m-0 mt-2 ">
                  <div className='col-auto'>
                     <Link className='pt-2 h5 text-center text-sm-left' to='/AboutUs'>About Us</Link>
                  </div>
                  <div className='col-auto'>
                     <Link className='pt-2 h5 text-center text-sm-left' to='/ContactUs'>Contact Us</Link>
                  </div>
               </div>
               <div className="row col-12 justify-content-center p-0 m-0 mt-2 mb-2 ">
                  <div className="col-auto">
                     <a href="https://www.linkedin.com/in/mahdi-joveyni-7bb48b14b/"
                        target="_blank">
                        <img src="/public/images/svgs/LinkIn.svg" className="svgclass alt" />
                     </a>
                     <a href="https://twitter.com/MahJove"
                        target="_blank">
                        <img src="/public/images/svgs/twitter.svg" className="svgclass alt" />
                     </a>
                     <img src="/public/images/svgs/Mahdi.svg" className="svgclass" />
                  </div>
                  <div className="col-auto">
                     <img src="/public/images/svgs/Majid.svg" className="svgclass" />

                     <a href="https://www.linkedin.com/in/majid-joveini-66072779/"
                        target="_blank">
                        <img src="/public/images/svgs/LinkIn.svg" className="svgclass alt" />
                     </a>
                     <a href="https://github.com/p8b"
                        target="_blank">
                        <img src="/public/images/svgs/git.svg" className="svgclass alt" />
                     </a>
                  </div>
                  <div className="col-12 text-center p-0 m-0 text-white cursor-default" children="&copy; 2020 TwoMJ" />
               </div>
            </Row>
         </Container>
      </footer>
   );
};
export default Footer;
