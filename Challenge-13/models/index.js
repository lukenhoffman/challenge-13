// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id', // The foreign key in the Products table that references the Category table
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id', // The foreign key in the Products table that references the Category table
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag, // The ProductTag model acts as the junction table
  foreignKey: 'product_id', // The foreign key in the ProductTag table that references the Products table
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag, // The ProductTag model acts as the junction table
  foreignKey: 'tag_id', // The foreign key in the ProductTag table that references the Tags table
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
