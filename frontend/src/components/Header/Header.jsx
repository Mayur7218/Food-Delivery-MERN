import React from 'react'
import './Header.css'
// import headImg from '../../../public/header_img.png'
const Header = () => {
  return (
    <div className='header'>
      <div className='header-contents'>
        <h2>Order your <br />favourite food here</h2>
        <p>Choose from diverse menu featuring a delectable array of dishescrafted with the finest ingredient and culinary expretise.Our mission is to satisfy your cravings and elevate your dinning experience, one delecious meal at a time.</p>
        <button>View Menu</button>
      </div>
    </div>
  )
}

export default Header