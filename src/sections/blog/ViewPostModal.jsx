import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ViewPostModal({ open, onClose, post }) {
  if (!post) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          {post.title}
        </Typography>
        <Typography
          id="modal-description"
          sx={{ mt: 2 }}
          dangerouslySetInnerHTML={{ __html: post.description }}
        />
        <Button onClick={onClose} sx={{ mt: 3 }} variant="contained">
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
}

ViewPostModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
