import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const SuperadminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdUsers, setCreatedUsers] = useState([]);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    retypePassword: '',
  });
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [editError, setEditError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState({
    oldPassword: false,
    newPassword: false,
    retypePassword: false,
  });

  useEffect(() => {
    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.userId.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/get-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (admin = null) => {
    if (admin) {
      setSelectedAdmin(admin);
      setFormData({
        userId: admin.userId,
        email: admin.email,
        name: admin.name,
        password: '',
      });
    } else {
      setSelectedAdmin(null);
      setFormData({
        userId: '',
        email: '',
        password: '',
        name: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAdmin(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateCredentials = (userId, password) => {
    const userIdRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    
    if (!userIdRegex.test(userId)) {
      return 'User ID must contain only letters and numbers';
    }
    if (password && !passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    const validationError = validateCredentials(formData.userId, formData.password);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (selectedAdmin) {
        await axios.put(
          `http://localhost:5000/api/users/update-users/${selectedAdmin.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/users/add-user',
          { ...formData, role: 'ADMIN' },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      handleClose();
      fetchUsers();
    } catch (error) {
      console.error('Error saving admin:', error);
      setEditError(error.response?.data?.error || 'Failed to save admin');
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/users/delete-users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.data?.details?.createdUsers) {
        setCreatedUsers(error.response.data.details.createdUsers);
        setError(error.response.data.details.message);
      } else {
        setError(error.response?.data?.error || 'Failed to delete user');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    setError('');
    setCreatedUsers([]);
  };

  const handleResetPasswordClick = (user) => {
    setSelectedUser(user);
    setResetPasswordData({
      oldPassword: '',
      newPassword: '',
      retypePassword: '',
    });
    setResetPasswordDialogOpen(true);
  };

  const handleResetPasswordClose = () => {
    setResetPasswordDialogOpen(false);
    setSelectedUser(null);
    setResetPasswordData({
      oldPassword: '',
      newPassword: '',
      retypePassword: '',
    });
  };

  const handleResetPasswordSubmit = async () => {
    setResetPasswordError('');
    if (!resetPasswordData.oldPassword || !resetPasswordData.newPassword || !resetPasswordData.retypePassword) {
      setResetPasswordError('All fields are required');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.retypePassword) {
      setResetPasswordError('New passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(resetPasswordData.newPassword)) {
      setResetPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/users/reset-password/${selectedUser.id}`,
        resetPasswordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleResetPasswordClose();
    } catch (error) {
      console.error('Error resetting password:', error);
      setResetPasswordError(error.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Admins
                </Typography>
                <Typography variant="h4" color="primary">
                  {users.filter(user => user.role === 'ADMIN').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4" color="success.main">
                  {users.filter(user => user.role === 'EMPLOYEE').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Recent Users (30 days)
                </Typography>
                <Typography variant="h4" color="info.main">
                  {users.filter(user => {
                    const date = new Date(user.createdAt);
                    const now = new Date();
                    return (now - date) <= 30 * 24 * 60 * 60 * 1000;
                  }).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            placeholder="Search by User ID, Name, or Email..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpen()}
            sx={{ 
              bgcolor: '#272727',
              '&:hover': {
                bgcolor: '#1a1a1a',
              }
            }}
          >
            Add New Admin
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: '#f8f9fa',
                      transition: 'background-color 0.2s'
                    } 
                  }}
                >
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: user.role === 'ADMIN' ? 'primary.light' : 'success.light',
                        color: user.role === 'ADMIN' ? 'primary.dark' : 'success.dark',
                      }}
                    >
                      {user.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleOpen(user)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary"
                      onClick={() => handleResetPasswordClick(user)}
                    >
                      <LockResetIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">
                      No users found matching your search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {selectedAdmin ? 'Edit Admin' : 'Add New Admin'}
          </DialogTitle>
          <DialogContent>
            {editError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {editError}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="User ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                helperText="Only letters and numbers allowed"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {!selectedAdmin && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  helperText="Must be at least 8 characters with uppercase, lowercase and number"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedAdmin ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogContentText>
            {createdUsers.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  This user has created the following users:
                </Typography>
                <List dense>
                  {createdUsers.map((user) => (
                    <ListItem key={user.id}>
                      <ListItemText 
                        primary={user.name}
                        secondary={`Role: ${user.role}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Please delete these users first before deleting {selectedUser?.name}.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={loading || createdUsers.length > 0}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={resetPasswordDialogOpen}
          onClose={handleResetPasswordClose}
          aria-labelledby="reset-password-dialog-title"
        >
          <DialogTitle id="reset-password-dialog-title">
            Reset Password for {selectedUser?.name}
          </DialogTitle>
          <DialogContent>
            {resetPasswordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {resetPasswordError}
              </Alert>
            )}
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Old Password"
                name="oldPassword"
                type={showResetPassword.oldPassword ? 'text' : 'password'}
                value={resetPasswordData.oldPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, oldPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowResetPassword({ ...showResetPassword, oldPassword: !showResetPassword.oldPassword })}
                      edge="end"
                    >
                      {showResetPassword.oldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                name="newPassword"
                type={showResetPassword.newPassword ? 'text' : 'password'}
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                helperText="Must be at least 8 characters with uppercase, lowercase and number"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowResetPassword({ ...showResetPassword, newPassword: !showResetPassword.newPassword })}
                      edge="end"
                    >
                      {showResetPassword.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Retype New Password"
                name="retypePassword"
                type={showResetPassword.retypePassword ? 'text' : 'password'}
                value={resetPasswordData.retypePassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, retypePassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowResetPassword({ ...showResetPassword, retypePassword: !showResetPassword.retypePassword })}
                      edge="end"
                    >
                      {showResetPassword.retypePassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResetPasswordClose}>Cancel</Button>
            <Button onClick={handleResetPasswordSubmit} variant="contained" color="primary">
              Reset Password
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default SuperadminDashboard; 