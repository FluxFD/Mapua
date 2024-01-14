import * as React from 'react'
import SignIn from '../../components/SignIn'
import theme from '../../components/Theme'
import { 
    ThemeProvider, 
} from '@mui/material'

const Login = () => {
    return (
        <ThemeProvider theme={theme}>
            <SignIn />
        </ThemeProvider>
    )
};

export default Login