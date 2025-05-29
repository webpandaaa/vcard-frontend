import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../Pages/Home'
import CreateCard from '../Pages/CreateCard'
import LiveCard from '../Pages/LiveCard'
import ShowCard from '../Pages/ShowCard'
import Live from '../Pages/Live'
import { ToastContainer } from 'react-toastify'
import PrivateRoutes from '../Pages/PrivateRoutes'; 

const Routing = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Wrap CreateCard route inside PrivateRoute */}
        <Route
          path="/create"
          element={
            <PrivateRoutes>
              <CreateCard />
            </PrivateRoutes>
          }
        />

        <Route path="card/find/:id" element={<LiveCard />} />
        <Route path="card/:username" element={<Live />} />
      </Routes>
      <ToastContainer/>
    </div>
  )
}

export default Routing
