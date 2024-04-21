import React from 'react'
import WidgetsTwoToneIcon from '@mui/icons-material/WidgetsTwoTone';
import "./styles.scss"

const Navbar = () => {
  return (
    <nav>
    <div className='container'>
      <div>
        <WidgetsTwoToneIcon/>
        <h1>Project Management App</h1>

      </div>
    </div>
  </nav>
  )
}

export default Navbar