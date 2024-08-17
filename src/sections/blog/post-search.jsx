import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

PostSearch.propTypes = {
  posts: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired, // Añadido para manejar la selección de un post
};

export default function PostSearch({ posts, onSelect }) {
  return (
    <Autocomplete
      sx={{ width: 280 }}
      autoHighlight
      popupIcon={null}
      slotProps={{
        paper: {
          sx: {
            width: 320,
            [`& .${autocompleteClasses.option}`]: {
              typography: 'body2',
            },
          },
        },
      }}
      options={posts}
      getOptionLabel={(post) => post.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, value) => onSelect(value)} // Esto se llama cuando un post es seleccionado
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Buscar contenido..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}

