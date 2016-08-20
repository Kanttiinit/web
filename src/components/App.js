import React from 'react'
import { connect } from 'react-redux'

import Header from './Header'
import DaySelector from './DaySelector'
import Restaurants from './Restaurants'
import Footer from './Footer'

const App = () => (
   <div>
     <Header />
     <div className="content">
       <DaySelector />
       <Restaurants />
     </div>
     <Footer />
   </div>
 )

export default connect()(App)
