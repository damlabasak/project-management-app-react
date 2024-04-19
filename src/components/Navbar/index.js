import React from 'react'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import "./styles.scss"

const Navbar = () => {
  return (
    <nav>
    <div className='container'>
      <div>
        <LibraryAddCheckIcon/>
        <h1>Project Management App</h1>
      </div>
    </div>
  </nav>
  )
}

export default Navbar