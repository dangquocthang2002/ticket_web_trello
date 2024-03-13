import React from 'react'

import Helmet from 'react-helmet'
import NavbarHeader from 'components/navbar-header/NavbarHeader'
import QuickAccess from 'components/quick-access'

const Home = () => {
    return (
      <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home | TonyTicket</title>
      </Helmet>
        <NavbarHeader />
        <div className='home'>
          <div className='home-shortcuts'>
            <h1>👋 Welcome to TonyTicket 👋</h1>
            <h5>⭐️ working and sharing in one platform! ⭐️</h5>
            <QuickAccess />
          </div>
        </div>
      </>
    )
  }

export default Home