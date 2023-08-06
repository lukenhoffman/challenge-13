const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Get all tags
router.get('/', async (req, res) => {
  try {
    // Find all tags and include their associated Product data
    const tags = await Tag.findAll({
      include: Product, // Include associated Products
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one tag
router.get('/:id', async (req, res) => {
  try {
    // Find a single tag by its `id` and include its associated Product data
    const tag = await Tag.findByPk(req.params.id, {
      include: Product, // Include associated Products
    });
    if (!tag) {
      res.status(404).json({ message: 'Tag not found.' });
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create new tag
router.post('/', async (req, res) => {
  try {
    // Create a new tag
    const tagData = await Tag.create(req.body);
    res.status(201).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update tag's name
router.put('/:id', async (req, res) => {
  try {
    // Update a tag's name by its `id` value
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete one tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      res.status(404).json({ message: 'Tag not found.' });
      return;
    }

    // Delete all associations with the tag from the ProductTag model (many-to-many relationship)
    await ProductTag.destroy({
      where: {
        tag_id: req.params.id,
      },
    });

    await tag.destroy();

    res.status(200).json({ message: 'Tag deleted successfully.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
