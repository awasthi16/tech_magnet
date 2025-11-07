import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='header'>

  <div className='subhead'>


<div className='icon'>


        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#0078FF" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
</div>


<div className='logo'><h1>SERP Analytics Dashboard</h1>
<p>DataForSEO API Integration

</p>
</div>


  </div>

  <div className='subbox'>
    <ul>
      <li>
<Link to="/">All Task</Link>
</li>
<li>
<Link to="/form">Form</Link>
</li>
<li>
<Link to="/result">Result</Link>
</li>

</ul>
  </div>

    </div>
  )
}

export default Header