import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

// Pages
import MiniDrawer from '../components/Drawer'
import HomePage from '../pages/Home'
import Courses from '../pages/Courses'
import Profile from '../pages/Profile'
import Calendar from '../pages/Calendar'
import Message from '../pages/Message'
// Firebase
import { auth } from '../services/Firebase'
import { ref, get, update } from "firebase/database";
import { database } from "../services/Firebase";
const MainPage = () => {
  const [selectedItem, setSelectedItem] = useState('Dashboard')
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Get the current user
      const user = auth.currentUser;
  
      // Update isActive field to false if user exists
      if (user) {
        const activeRef = ref(database, `students/${user.uid}`);
        await update(activeRef, {
          isActive: false
        });
      }
  
      // Sign out the user
      await auth.signOut();
  
      // Remove stored credentials and other data
      localStorage.removeItem('credentials');
      localStorage.removeItem('studentNo');
      localStorage.removeItem('studentData');
  
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  

  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  const renderPageContent = () => {
    switch (selectedItem) {
      case 'Dashboard':
        return <HomePage />
      case 'Courses':
        return <Courses />
      case 'Profile':
        return <Profile />
      case 'Calendar':
        return <Calendar />
      case 'Message':
        return <Message />
      case 'Logout':
        handleLogout()
        return null
      default:
        return null
    }
  }

  return (
    <div>
      <MiniDrawer onItemClick={handleItemClick} selectedItem={selectedItem} />
      <Container fluid>{renderPageContent()}</Container>
      <iframe
        src="http://localhost/fingerprint/logout"
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default MainPage
