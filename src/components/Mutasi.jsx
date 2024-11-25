// CartDrawer.jsx

import React from 'react';
import Mutasi from './Mutasi'; // Adjust the path as necessary

const CartDrawer = ({ cart, totalPrice, phoneNumber, otpCode, setPhoneNumber, setOtpCode, handlePesanClick, isOtpSent }) => {
  return (
    <div className="cart-drawer">
      {/* Other cart drawer content goes here, like items in the cart */}

      {/* Include the Mutasi component here */}
      <Mutasi
        cart={cart}
        totalPrice={totalPrice}
        phoneNumber={phoneNumber}
        otpCode={otpCode}
        setPhoneNumber={setPhoneNumber}
        setOtpCode={setOtpCode}
        handlePesanClick={handlePesanClick}
        isOtpSent={isOtpSent}
      />
    </div>
  );
};

export default CartDrawer;
