import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Projects from './Pages/Projects'
import DashBoard from './Pages/DashBoard'
import BuildWise from './Pages/Home'
import ProjectDetails from './Pages/ProjectDetails'
import About from './Pages/About'
import AdminPanel from './Pages/AdminPanel'
import BuildWiseLearningPage from './Pages/BuildWiseLearningPage'
import Login from './Pages/Login'
import Register from './Pages/Register'
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { BuildWiseToaster } from './Components/BuildWiseToast'
const App = () => {
    const user = {
        name: "Debjit",
        role: "admin", // change to "user" to test
    };
    return (
        <>
            <BuildWiseToaster/>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/projects' element={<Projects />} />
                <Route path='/dashboard' element={<DashBoard />} />
                <Route path="/projectdetails/:slug" element={<ProjectDetails />} />
                <Route path="/about" element={<About />} />
                <Route
                    path="/admin"
                    element={
                        user?.role === "admin"
                            ? <AdminPanel />
                            : <Navigate to="/dashboard" />
                    }
                />
                <Route path="/projectdetails/:slug/learningpage" element={<BuildWiseLearningPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </>
    )
}

export default App