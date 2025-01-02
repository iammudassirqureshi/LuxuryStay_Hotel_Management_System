import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './Components/navBar.jsx'
// import TestingSlider from './Pages/testingSlider.jsx'
import HomePage from './Pages/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <NavBar/>
    <Routes>
     <Route path="/" element={<HomePage />} /> 
    {/* <Route path='/' element={<App/>}/>  */}
    {/* <Route path='/' element={<TestingSlider/>}/> */}

    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
