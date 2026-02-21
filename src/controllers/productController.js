const Product = require('../../models/Product');
const { cloudinary } = require('../config/cloudinary');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.json([]);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, description, fabricType, texture, quality, care } = req.body;

        const images = req.files && req.files.length > 0
            ? req.files.map(file => file.path)
            : ['https://via.placeholder.com/400x400'];

        const cloudinaryIds = req.files && req.files.length > 0
            ? req.files.map(file => file.public_id)
            : [];

        const newProduct = new Product({
            name,
            price,
            category,
            description,
            fabricType,
            texture,
            quality,
            care,
            image: images[0],
            images,
            cloudinaryId: cloudinaryIds[0] || null,
            cloudinaryIds
        });

        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, description, fabricType, texture, quality, care } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let updateData = {
            name: name || product.name,
            price: price || product.price,
            category: category || product.category,
            description: description || product.description,
            fabricType: fabricType || product.fabricType,
            texture: texture || product.texture,
            quality: quality || product.quality,
            care: care || product.care
        };

        if (req.files && req.files.length > 0 || req.body.keptImages) {
            let keptImages = [];
            let keptCloudinaryIds = [];

            if (req.body.keptImages) {
                const keptUrls = JSON.parse(req.body.keptImages);
                product.images.forEach((img, index) => {
                    if (keptUrls.includes(img)) {
                        keptImages.push(img);
                        if (product.cloudinaryIds && product.cloudinaryIds[index]) {
                            keptCloudinaryIds.push(product.cloudinaryIds[index]);
                        }
                    } else {
                        // This image was removed, delete from Cloudinary
                        const cid = product.cloudinaryIds ? product.cloudinaryIds[index] : null;
                        if (cid) {
                            cloudinary.uploader.destroy(cid).catch(err => console.error('Cloudinary delete error:', err));
                        }
                    }
                });
            } else if (!req.files || req.files.length === 0) {
                // If no keptImages provided and no new files, keep current images
                keptImages = product.images;
                keptCloudinaryIds = product.cloudinaryIds;
            }

            const newImages = req.files ? req.files.map(file => file.path) : [];
            const newCloudinaryIds = req.files ? req.files.map(file => file.public_id) : [];

            const finalImages = [...keptImages, ...newImages];
            const finalCloudinaryIds = [...keptCloudinaryIds, ...newCloudinaryIds];

            updateData.image = finalImages[0] || 'https://via.placeholder.com/400x400';
            updateData.images = finalImages;
            updateData.cloudinaryId = finalCloudinaryIds[0] || null;
            updateData.cloudinaryIds = finalCloudinaryIds;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        try {
            if (product.cloudinaryIds && product.cloudinaryIds.length > 0) {
                for (const cloudinaryId of product.cloudinaryIds) {
                    if (cloudinaryId) {
                        await cloudinary.uploader.destroy(cloudinaryId);
                    }
                }
            } else if (product.cloudinaryId) {
                await cloudinary.uploader.destroy(product.cloudinaryId);
            }
        } catch (cloudinaryError) {
            console.log('Cloudinary deletion error (ignored):', cloudinaryError);
        }

        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
