import React, { useEffect, useState } from 'react'
import { Container, Card, Col, Row } from 'react-bootstrap'
import AddIcon from '@mui/icons-material/Add'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { database } from '../services/Firebase'
import { ref, onValue } from 'firebase/database'
import useAuth from '../services/Auth'

function Courses() {
  return (
    <Container fluid style={{ paddingLeft: '13%', paddingRight: '1%' }}>
      <h1>hello</h1>
    </Container>
  )
}

export default Courses
