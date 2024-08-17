import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReactQuill from 'react-quill'; // Importa Quill
import 'react-quill/dist/quill.snow.css'; // Importa el CSS de Quill

export default function EditPostModal({ open, onClose, post, onSave }) {
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
  
    const handleSave = () => {
      const updatedPost = {
        ...post,
        title,
        description,
        updatedAt: new Date(),
      };
      onSave(updatedPost);
      onClose();
    };
  
    return (
      <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Editar contenido
          </Typography>
          <TextField
            fullWidth
            label="Título"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Descripción
          </Typography>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={{
              toolbar: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']
              ],
            }}
          />
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogActions>
        </Box>
      </Modal>
    );
  }
  
  EditPostModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
  };
  
