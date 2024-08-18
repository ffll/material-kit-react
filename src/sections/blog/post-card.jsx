import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

export default function PostCard({ post, index, userRole, onEdit, onOpen, onDelete }) {
  const { imageUrl, title, createdAt, views, interactions } = post;

  return (
    <Grid xs={12} sm={6} md={3}>
      <Card
        onClick={() => onOpen(post)} // Hacemos toda la tarjeta clicable
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)', // Aumenta el tamaño ligeramente
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Añade una sombra más pronunciada
          },
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'relative', pt: 'calc(100% * 3 / 4)' }}>
          <Box
            component="img"
            alt={title}
            src={imageUrl || '/assets/default_post_img.svg'} // Utiliza imageUrl en lugar de cover
            sx={{
              top: 0,
              width: 1,
              height: 1,
              objectFit: 'cover',
              position: 'absolute',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()} // Evita que el clic en los iconos propague el evento
          >
            <IconButton
              aria-label="share"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Más oscuro al hacer hover
                },
              }}
            >
              <Iconify icon="eva:share-fill" sx={{ color: 'white' }} />
            </IconButton>
            {userRole === 'admin' && (
              <>
                <IconButton
                  aria-label="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(post);
                  }}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Más oscuro al hacer hover
                    },
                  }}
                >
                  <Iconify icon="eva:edit-fill" sx={{ color: 'white' }} />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post._id);
                  }}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Más oscuro al hacer hover
                    },
                  }}
                >
                  <Iconify icon="eva:trash-2-fill" sx={{ color: 'white' }} />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            {fDate(createdAt)}
          </Typography>

          <Typography
            variant="subtitle2"
            color="inherit"
            underline="hover"
            sx={{
              height: 44,
              overflow: 'hidden',
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </Typography>

          <Stack
            direction="row"
            flexWrap="wrap"
            spacing={1.5}
            justifyContent="flex-end"
            sx={{ mt: 3, color: 'text.disabled' }}
          >
            <Stack direction="row" sx={{ color: 'text.disabled' }}>
              <Iconify icon="eva:eye-fill" sx={{ mr: 0.5 }} />
              <Typography variant="caption">{fShortenNumber(views)}</Typography>
            </Stack>
            {interactions.map((interaction, _index) => (
              <Stack key={_index} direction="row" sx={{ color: 'text.disabled' }}>
                <Iconify icon={`eva:${interaction.interactionType}-fill`} sx={{ mr: 0.5 }} />
                <Typography variant="caption">{fShortenNumber(interaction.count)}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Card>
    </Grid>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
  userRole: PropTypes.string,
  onEdit: PropTypes.func.isRequired, // Función para manejar la edición
  onOpen: PropTypes.func.isRequired, // Función para manejar la apertura del modal
  onDelete: PropTypes.func.isRequired, // Función para manejar la eliminación
};

