import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	Container,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import { AuthContext } from '../../../context/AuthContext';
import './LoginPage.css';
const LoginPage = () => {
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);
	const PASSWORD = import.meta.env.VITE_REACT_APP_ACCSESS_TO_TABLE_PAGE;

	const handleLogin = (e) => {
		e.preventDefault();
		if (password === PASSWORD) {
			login();
			navigate('/table');
		} else {
			alert('סיסמא שגויה. אנא נסה שוב.');
		}
	};

	return (
		<div className='LoginPage'>
			<Container direction='rtl'>
				<Card>
					<CardContent>
						<Typography
							variant='h5'
							component='h2'
							align='center'
						>
							התחברות
						</Typography>
						<form
							onSubmit={handleLogin}
							style={{ textAlign: 'center', marginTop: '20px' }}
						>
							<TextField
								label='נא הזן סיסמא'
								placeholder='נא הזן סיסמא'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								variant='outlined'
								fullWidth
								InputProps={{
									style: { textAlign: 'right' },
									endAdornment: (
										<InputAdornment
											position='end'
											style={{ marginRight: '12px' }}
										>
											<Divider orientation='vertical' />
										</InputAdornment>
									),
								}}
								InputLabelProps={{
									shrink: true,
									style: { direction: 'rtl', textAlign: 'right' },
								}}
								style={{ marginBottom: '20px' }}
							/>
							<Button
								type='submit'
								variant='contained'
								color='primary'
							>
								התחבר
							</Button>
						</form>
					</CardContent>
				</Card>
			</Container>
		</div>
	);
};

export default LoginPage;
