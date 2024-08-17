const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Ordenamos por la fecha de creación, de más reciente a más antiguo
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo post (solo para administradores)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, imageUrl } = req.body;

  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden crear posts.' });
    }

    const newPost = new Post({
      title,
      description,
      imageUrl: imageUrl || '/assets/default_post_img.svg',
    });

    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar una interacción (visualización o compartido)
router.post('/:id/interact', authMiddleware, async (req, res) => {
  const { interactionType } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    // Añadir la interacción al post
    post.interactions.push({
      user: req.user._id, // Guardar la referencia al usuario que interactuó
      interactionType,
    });

    // Incrementar el contador de vistas si la interacción es una visualización
    if (interactionType === 'view') {
      post.views += 1;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar un post existente (solo para administradores)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, imageUrl } = req.body;

  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden editar posts.' });
    }

    const updatedPost = {
      title,
      description,
      imageUrl: imageUrl || '/assets/default_post_img.svg',
      updatedAt: new Date(), // Registramos la fecha de actualización
    };

    const post = await Post.findByIdAndUpdate(req.params.id, updatedPost, { new: true });
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un post por su ID (solo para administradores)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden eliminar posts.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    await Post.deleteOne({ _id: req.params.id }); // Utilizando deleteOne para eliminar el post
    res.json({ message: 'Contenido eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;









