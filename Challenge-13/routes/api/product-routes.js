const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  try {
    // Find all products and include their associated Category and Tag data
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'], // Include specific attributes from Category model
        },
        {
          model: Tag,
          through: ProductTag, // Include Tags through the ProductTag model
          attributes: ['id', 'tag_name'], // Include specific attributes from Tag model
        },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one product
router.get('/:id', async (req, res) => {
  try {
    // Find a single product by its `id` and include its associated Category and Tag data
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'], // Include specific attributes from Category model
        },
        {
          model: Tag,
          through: ProductTag, // Include Tags through the ProductTag model
          attributes: ['id', 'tag_name'], // Include specific attributes from Tag model
        },
      ],
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    // Create a new product
    const product = await Product.create(req.body);

    // If there are product tags, create pairings in the ProductTag model (many-to-many relationship)
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    // Update product data
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // If there are product tags, update the associations in the ProductTag model (many-to-many relationship)
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagsToRemove = await ProductTag.findAll({
        where: {
          product_id: req.params.id,
          tag_id: { $notIn: req.body.tagIds },
        },
      });

      await ProductTag.destroy({ where: { id: productTagsToRemove.map(({ id }) => id) } });

      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagsToRemove.map(({ tag_id }) => tag_id).includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      await ProductTag.bulkCreate(newProductTags);
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }

    await ProductTag.destroy({
      where: {
        product_id: req.params.id,
      },
    });

    await product.destroy();

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
