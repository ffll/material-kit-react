import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { decodeJwt } from 'jose';
import axios from 'axios';

import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Iconify from 'src/components/iconify';
import { toast } from 'react-toastify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';
import EditPostModal from '../EditPostModal';
import ViewPostModal from '../ViewPostModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal';

export default function BlogView() {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', description: '', imageUrl: '' });
  const [editPost, setEditPost] = useState(null);
  const [viewPost, setViewPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = decodeJwt(token);
      setUserRole(decoded.role);
      setUserId(decoded.id);
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error.response?.data || error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewPost({ ...newPost, imageUrl: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const postData = {
      title: newPost.title,
      description: newPost.description,
      imageUrl: newPost.imageUrl || '/assets/default_post_img.svg',
      author: userId,
    };
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/posts', postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);

      handleClose();

      toast.success('Nuevo Contenido creado con éxito!');
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);

      toast.error('Error al crear el post');
    }
  };

  const handleDelete = (postId) => {
    setDeletePost(postId);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Deleting post with ID: ${deletePost}`); // Log for debugging
      await axios.delete(`http://localhost:5000/api/posts/${deletePost}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((post) => post._id !== deletePost));
      setConfirmDeleteOpen(false);

      toast.success('Contenido eliminado con éxito!');
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
      toast.error('Error al eliminar el post');
    }
  };

  const handleEdit = (post) => {
    setEditPost(post);
  };

  const handleSaveEdit = async (updatedPost) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/posts/${updatedPost._id}`, updatedPost, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);

      toast.success('Contenido actualizado con éxito!');
    } catch (error) {
      console.error('Error updating post:', error.response?.data || error.message);
      toast.error('Error al guardar el post');
    }
  };

  const handleView = (post) => {
    setViewPost(post);
  };

  const handleCloseView = () => {
    setViewPost(null);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Contenidos</Typography>

        {userRole === 'admin' && (
          <Button
            variant="contained"
            color="inherit"
            sx={{ backgroundColor: 'primary.orange' }}
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpen}
          >
            Nuevo contenido
          </Button>
        )}
      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <PostSearch posts={posts} />
        <PostSort
          options={[
            { value: 'latest', label: 'Lo más nuevo' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Lo más antiguo' },
          ]}
        />
      </Stack>

      <Grid container spacing={3}>
        {posts.map((post, index) => (
          <PostCard
            key={post._id}
            post={post}
            index={index}
            userRole={userRole}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpen={handleView}
          />
        ))}
      </Grid>

      {editPost && (
        <EditPostModal
          open={Boolean(editPost)}
          onClose={() => setEditPost(null)}
          post={editPost}
          onSave={handleSaveEdit}
        />
      )}

      {viewPost && (
        <ViewPostModal open={Boolean(viewPost)} onClose={handleCloseView} post={viewPost} />
      )}

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
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
            Crear nuevo contenido
          </Typography>
          <TextField
            fullWidth
            label="Título"
            margin="normal"
            name="title"
            value={newPost.title}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Descripción"
            margin="normal"
            name="description"
            multiline
            rows={4}
            value={newPost.description}
            onChange={handleChange}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Seleccionar imagen
            <input type="file" hidden name="imageUrl" onChange={handleImageChange} />
          </Button>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Crear</Button>
          </DialogActions>
        </Box>
      </Modal>
    </Container>
  );
}











