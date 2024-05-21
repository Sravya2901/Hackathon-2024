import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
// Icons
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
// data
import notifications from '@/_mocks/notifications';

function NotificationsButton() {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);

	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const toNotifications = () => {
		handleClose();
		navigate('/pages/notifications');
	};

	const [aqiData, setAqiData] = useState(null);
	useEffect(() => {
		const fetchAQI = async () => {
		  try {
			const response = await axios.get('https://api.waqi.info/feed/hyderabad/?token=5623bcaf76f66784071cbde1be0ba9abf4377a06');
			setAqiData(response.data);
		  } catch (error) {
			console.error('Error fetching AQI data:', error);
		  }
		};
		fetchAQI();
	  }, []);
	
	  useEffect(() => {
		if (aqiData && aqiData?.status === 'ok' && aqiData?.data?.aqi > 300) {
			console.log('aqi')
			notifications.unshift({
				id: uuid(),
				name: aqiData?.data?.city?.name,
				title: 'The Air Quality index is very high. Please acknowledge',
				date: '30/07/2021  - follow necessary precautions',
				checked: false,
				aqi: aqiData?.data?.aqi
			})		//    sendAlertToBackend(`The current AQI vales is ${aqiData?.data?.aqi} which is very High. Please take necessary precautions `);
		}
	  });

	return (
		<>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'notificaciones menu',
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<Stack
					sx={{
						maxWidth: 400,
						p: 2,
						pb: 0,
					}}
					direction="column"
					spacing={2}
				>
					<Stack direction="row" justifyContent="space-between" flexWrap="wrap">
						<Stack
							direction="row"
							alignItems="center"
							spacing={1}
							divider={<Divider orientation="vertical" flexItem />}
						>
							<Typography variant="subtitle1">Notifications</Typography>
							<Box
								component="span"
								bgcolor="secondary.main"
								borderRadius="20px"
								fontSize={12}
								px={1}
								py={0.5}
								color="secondary.contrastText"
							>
								1
							</Box>
						</Stack>
						<IconButton
							aria-label="close notifications menu"
							onClick={handleClose}
							size="small"
							color="primary"
							sx={{
								border: 1,
								display: {
									sm: 'none',
									xs: 'inline-flex',
								},
							}}
						>
							<CloseIcon fontSize="inherit" />
						</IconButton>
					</Stack>

					<Divider
						sx={{
							my: 1,
						}}
					/>

					<Stack direction="column" spacing={1} divider={<Divider flexItem />}>
						{notifications.slice(0, 5).map((notification) => (
							<Notification key={notification.id} notification={notification} />
						))}
					</Stack>
				</Stack>
			</Menu>
			<Tooltip title="Notifications">
				<IconButton onClick={handleClick} size="small">
					<Badge color="secondary" overlap="rectangular" variant="dot">
						<NotificationsOutlinedIcon color="primary" fontSize="small" />
					</Badge>
				</IconButton>
			</Tooltip>
		</>
	);
}

function Notification({ notification }) {
    // State to manage button text and color
    const [buttonText, setButtonText] = useState('Acknowledge - Yes, I am Safe');
    const [buttonColor, setButtonColor] = useState('error'); // Initial color is 'error'

    // Function to change button text and color
    const handleButtonClick = () => {
        setButtonText('Acknowledged'); // Change text
        setButtonColor('success'); // Change color to success or any other color you prefer
    };

    return (
        <ButtonBase
            sx={{
                py: 1,
                px: 2,
                '&:hover': {
                    bgcolor: (theme) => theme.palette.action.hover,
                },
                borderLeft: 3,
                borderLeftColor: notification?.checked ? '#FF0000' : 'error.main', // Corrected color code format
            }}
        ><Stack width="100%" direction="row" spacing={2} alignItems="center" justifyContent="flex-start"><Stack direction="column" justifyContent="flex-start" alignItems="flex-start"><Typography align="left"><strong>{notification?.name} </strong> {notification?.aqi} {notification?.title}
                    </Typography><Typography variant="caption"><AccessTimeIcon fontSize="inherit" sx={{ mr: 0.3 }} />
                        {notification?.date}
                    </Typography>
                    {/* Update button with dynamic text and color based on state */}
                    <Button 
                      size='small' 
                      variant='contained' 
                      color={buttonColor} 
                      onClick={handleButtonClick}
                    >
                        {buttonText}
                    </Button></Stack></Stack></ButtonBase>
    );
}

// function Notification({ notification }) {
	
// 	return (
// 		<ButtonBase
// 			sx={{
// 				py: 1,
// 				px: 2,
// 				'&:hover': {
// 					bgcolor: (theme) => alpha(theme.palette.primary.light, 0.1),
// 				},
// 				borderLeft: 3,
// 				borderLeftColor: notification?.checked ? '#Ff000' : 'error.400',
// 			}}
// 		>
// 			<Stack width="100%" direction="row" spacing={2} alignItems="center" justifyContent="flex-start">
// 				<Stack direction="column" justifyContent="flex-start" alignItems="flex-start">
// 					<Typography align="left">
// 						<strong>{notification?.name} </strong> {notification?.aqi}
// 						{notification?.title}
// 					</Typography>
// 					<Typography variant="caption">
// 						<AccessTimeIcon
// 							fontSize="inherit"
// 							sx={{
// 								mr: 0.3,
// 							}}
// 						/>
// 						{notification?.date}
// 					</Typography>
// 					<Button size='small' variant='contained' color='error'>Acknowledge - Yes,I am Safe</Button>
// 				</Stack>
// 			</Stack>
// 		</ButtonBase>
// 	);
// }

export default NotificationsButton;
