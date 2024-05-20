// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
// import Card from '@mui/material/Card';
// import TextField from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';
// import Button from '@mui/material/Button';

// import EditIcon from '@mui/icons-material/Edit';

// import CardHeader from '@/components/cardHeader';

// function Profile() {
// 	return (
// 		<Stack spacing={6}>
// 			<ProfileSection />
// 		</Stack>
// 	);
// }

// function ProfileSection() {
// 	return (
// 		<Card type="section">
// 			<CardHeader title="Profile Information" />
// 			<Stack spacing={6}>
// 				<form onSubmit={() => {}}>
// 					<Grid container spacing={3}>
// 						<Grid item xs={12} sm={6} md={6}>
// 							<TextField label="First Name" variant="outlined" defaultValue="Elizabeth" fullWidth />
// 						</Grid>
// 						<Grid item xs={12} sm={6} md={6}>
// 							<TextField label="Last Name" variant="outlined" defaultValue="Lumaad Olsen" fullWidth />
// 						</Grid>
// 						<Grid item xs={12} sm={6} md={6}>
// 							<TextField
// 								type="email"
// 								label="Account Email"
// 								variant="outlined"
// 								defaultValue="demo@sample.com"
// 								fullWidth
// 							/>
// 						</Grid>
// 						<Grid item xs={12} sm={6} md={6}>
// 							<TextField label="Phone Number" variant="outlined" defaultValue="000-00-00-00" fullWidth />
// 						</Grid>
// 						<Grid item xs={12} sm={6} md={6}>
// 							<TextField label="Company Name" variant="outlined" defaultValue="company.ltd" fullWidth />
// 						</Grid>
// 						<Grid item xs={12} sm={6} md={6}>
// 							<TextField
// 								label="Site Information"
// 								variant="outlined"
// 								defaultValue="www.company.com"
// 								fullWidth
// 							/>
// 						</Grid>

// 						<Grid item xs={12} sm={6} md={6}>
// 							<Stack spacing={3}>
// 								<TextField select fullWidth label="Location" variant="outlined" defaultValue="1">
// 									<MenuItem value="1">CDMX </MenuItem>
// 									<MenuItem value="2">India </MenuItem>
// 									<MenuItem value="3">Africa</MenuItem>
// 									<MenuItem value="4">New York</MenuItem>
// 								</TextField>
// 								<TextField select fullWidth label="Experience" variant="outlined" defaultValue="1">
// 									<MenuItem value="1">1 year </MenuItem>
// 									<MenuItem value="2">2 year </MenuItem>
// 									<MenuItem value="3">3 year</MenuItem>
// 									<MenuItem value="4">4 year</MenuItem>
// 								</TextField>
// 							</Stack>
// 						</Grid>
// 						<Grid item xs={12} sm={6} md={6}>
// 							<TextField
// 								multiline
// 								minRows={5}
// 								label="Bio"
// 								defaultValue="I consider myself as a creative, professional and a flexible person. I can adapt with any kind of brief and design style"
// 								fullWidth
// 							/>
// 						</Grid>

// 						<Grid item xs={12} sm={12} md={12}>
// 							<Button
// 								disableElevation
// 								variant="contained"
// 								endIcon={<EditIcon />}
// 								sx={{
// 									float: 'right',
// 								}}
// 							>
// 								Update Account
// 							</Button>
// 						</Grid>
// 					</Grid>
// 				</form>
// 			</Stack>
// 		</Card>
// 	);
// }

// export default Profile;

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

import CardHeader from '@/components/cardHeader';
import { Alert , Divider, Typography } from '@mui/material';

function Profile() {
    return (
        <Stack spacing={6}><ProfileSection /></Stack>
    );
}

function ProfileSection() {
    // Initialize state for each form field
	const [alert, setAlert] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('************');
    const [companyName, setCompanyName] = useState('***********');
    const [siteInfo, setSiteInfo] = useState('***************');
    const [fev, setfev] = useState('');
    const [bmi, setbmi] = useState('');
	const [min, setmin] = useState('');
    const [alpha, setalpha] = useState('');

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        // Reset the state values
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setCompanyName('');
        setSiteInfo('');
        setfev('');
        setbmi('');
        setalpha('');
		setbmi('');
        setmin('');
		setAlert('alert')// Show an alert
    };

    return (
        <Card type="section"><CardHeader title="Profile Information" /><Stack spacing={6}>
			{alert !== '' && <Alert severity="success" variant='filled'>Account has been created and details are updated</Alert>}
			<form onSubmit={handleSubmit}><Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}><TextField label="First Name" variant="outlined" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Grid><Grid item xs={12} sm={6} md={6}><TextField label="Last Name" variant="outlined" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} /></Grid>
						<Grid item xs={12} sm={6} md={6}><TextField type="email" label="Account Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)}/> </Grid><Grid item xs={12} sm={6} md={6}><TextField label="Phone Number" variant="outlined" defaultValue="000-00-00-00" fullWidth value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/></Grid>
                        <Grid item xs={12} sm={6} md={6}><TextField label="Emergency Contact" variant="outlined" fullWidth value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></Grid><Grid item xs={12} sm={6} md={6}><TextField label="Hospital/Doctor Number" variant="outlined" fullWidth value={siteInfo} onChange={(e) => setSiteInfo(e.target.value)} /></Grid>
						<Grid item xs={12} sm={12} md={12}><Divider sx={{borderColor: 'primary.light',my: 1}}/></Grid>
						<Grid item xs={12} sm={12} md={12}><Typography variant="h5" gutterBottom>Patient Metrics Information</Typography></Grid>
						<Grid item xs={6} sm={3} md={3}><TextField label="FEV1 (%)" variant="outlined" fullWidth value={fev} onChange={(e) => setfev(e.target.value)} /></Grid><Grid item xs={6} sm={3} md={3}><TextField label="BMI (kg/m²)" variant="outlined" fullWidth value={bmi} onChange={(e) => setbmi(e.target.value)} /></Grid>
						<Grid item xs={6} sm={3} md={3}><TextField label="alpha-1 level" variant="outlined" fullWidth value={alpha} onChange={(e) => setalpha(e.target.value)} /></Grid><Grid item xs={6} sm={3} md={3}><TextField label="6 minute walk test(m)" variant="outlined" fullWidth value={min} onChange={(e) => setmin(e.target.value)} /></Grid>
						<Grid item xs={6} sm={12} md={12}><Button
                                type="submit"
                                disableElevation
                                variant="contained"
                                endIcon={<EditIcon />}
                                sx={{
                                    float: 'right',
								}}
                            >
                                Update Account
                            </Button></Grid></Grid></form></Stack></Card>
    );
}

export default Profile;
