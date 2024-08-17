import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeJwt } from 'jose'; // Importa la función para decodificar el token

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { account } from 'src/_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Dashboard',
    icon: 'eva:home-fill',
  },
  // {
  //   label: 'Perfil',
  //   icon: 'eva:person-fill',
  // },
  // {
  //   label: 'Configuración',
  //   icon: 'eva:settings-2-fill',
  // },
];

// ----------------------------------------------------------------------
function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
    console.log('Popover opened');  // Añadir mensaje de consola
  };

  const handleClose = () => {
    setOpen(null);
    console.log('Popover closed');  // Añadir mensaje de consola
  };

  const handleLogout = () => {
    console.log('Logout clicked');  // Añadir mensaje de consola
    localStorage.removeItem('token');
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Stored token:', token);  // Añade este log para verificar el token almacenado

    if (token) {
      const decoded = decodeJwt(token); // Decodifica el token para obtener los datos del usuario
      console.log('Decoded token:', decoded); // Verifica el contenido del token en la consola
      setUser({
        firstName: decoded.firstName, // Asegúrate de que estas propiedades existen en tu token
        lastName: decoded.lastName,
        email: decoded.email,
        role: decoded.role,
      });
    }
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={user.firstName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user.firstName}&nbsp;{user.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'primary.orange' }} noWrap>
            {capitalizeFirstLetter(user.role)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}  // Asegúrate de usar handleLogout
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}




