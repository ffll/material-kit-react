import { useState, useEffect } from 'react';
import axios from 'axios';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('firstName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    password: 'password1',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpen = () => {
    setEditMode(false);
    setNewUser({ firstName: '', lastName: '', email: '', role: 'user', password: 'password1' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleRoleChange = (event) => {
    setNewUser({ ...newUser, role: event.target.checked ? 'admin' : 'user' });
  };

  const handleAddUser = async () => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/users/${currentUserId}`, newUser);
        const updatedUsers = users.map((user) =>
          user._id === currentUserId ? { ...user, ...newUser } : user
        );
        setUsers(updatedUsers);
        setConfirmationTitle('Success');
        setConfirmationMessage('User updated successfully.');
      } else {
        const response = await axios.post('http://localhost:5000/api/users', newUser);
        setUsers([...users, response.data]);
        setConfirmationTitle('Success');
        setConfirmationMessage('User added successfully.');
      }
    } catch (error) {
      setConfirmationTitle('Error');
      setConfirmationMessage(error.response ? error.response.data : 'Error adding/updating user.');
    } finally {
      setOpenConfirmation(true);
      handleClose();
    }
  };

  const handleEditUser = (user) => {
    setEditMode(true);
    setCurrentUserId(user._id);
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: user.password,
    });
    setOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${currentUserId}`);
      setUsers(users.filter((user) => user._id !== currentUserId));
      setConfirmationTitle('Success');
      setConfirmationMessage('User deleted successfully.');
    } catch (error) {
      setConfirmationTitle('Error');
      setConfirmationMessage('Error deleting user.');
    } finally {
      setOpenConfirmation(true);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      await Promise.all(selected.map(id => axios.delete(`http://localhost:5000/api/users/${id}`)));
      const remainingUsers = users.filter(user => !selected.includes(user._id));
      setUsers(remainingUsers);
      setSelected([]);
      setConfirmationTitle('Success');
      setConfirmationMessage('Users deleted successfully.');
    } catch (error) {
      setConfirmationTitle('Error');
      setConfirmationMessage('Error deleting users.');
    } finally {
      setOpenConfirmation(true);
    }
  };

  const handleSortUsers = () => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy('firstName');
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Usuarios</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpen}
        >
          Nuevo usuario
        </Button>
      </Stack>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {editMode ? 'Edit User' : 'Add New User'}
          </Typography>
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          />
          <TextField
            fullWidth
            label="Apellido"
            margin="normal"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newUser.role === 'admin'}
                onChange={handleRoleChange}
                name="isAdmin"
                color="primary"
              />
            }
            label="Es administrador"
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleAddUser}>
              {editMode ? 'Guardar cambios' : 'Agregar usuario'}
            </Button>
          </DialogActions>
        </Box>
      </Modal>

      <Dialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{confirmationTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmationMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmation(false)} color="primary" autoFocus>
            {confirmationTitle === 'Error' ? 'Close' : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmation && confirmationTitle === 'Eliminar usuario'}
        onClose={() => setOpenConfirmation(false)}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Eliminar usuario</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            ¿Estás seguro que quieres eliminar este usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmation(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDelete={handleDeleteUsers} // Vincular la función de eliminación múltiple
          onSort={handleSortUsers} // Vincular la función de ordenación
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'firstName', label: 'Nombre' },
                  { id: 'email', label: 'Email' },
                  { id: 'role', label: 'Rol' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <UserTableRow
                      key={user._id}
                      name={`${user.firstName} ${user.lastName}`}
                      role={user.role}
                      email={user.email}
                      selected={selected.indexOf(user._id) !== -1}
                      handleClick={(event) => handleClick(event, user._id)}
                      onEdit={() => handleEditUser(user)}
                      onDelete={() => {
                        setConfirmationTitle('Eliminar usuario');
                        setConfirmationMessage('¿Estás seguro que quieres eliminar este usuario?');
                        setCurrentUserId(user._id);
                        setOpenConfirmation(true);
                      }}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}



