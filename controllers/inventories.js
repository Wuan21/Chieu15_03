let inventoryModel = require('../schemas/inventories');
let productModel = require('../schemas/products');

async function getActiveProduct(productId) {
    let product = await productModel.findById(productId);
    if (!product) {
        return { error: { status: 404, message: 'product not found' } };
    }
    if (product.isDeleted) {
        return { error: { status: 400, message: 'product is deleted' } };
    }
    return { product };
}

module.exports = {
    GetAllInventories: async function () {
        return inventoryModel.find().populate('product');
    },
    GetInventoryById: async function (id) {
        return inventoryModel.findById(id).populate('product');
    },
    AddStock: async function (productId, quantity) {
        let checkProduct = await getActiveProduct(productId);
        if (checkProduct.error) {
            return checkProduct;
        }

        let updated = await inventoryModel.findOneAndUpdate(
            { product: productId },
            { $inc: { stock: quantity } },
            { new: true }
        ).populate('product');

        if (!updated) {
            return { error: { status: 404, message: 'inventory not found' } };
        }

        return { data: updated };
    },
    RemoveStock: async function (productId, quantity) {
        let checkProduct = await getActiveProduct(productId);
        if (checkProduct.error) {
            return checkProduct;
        }

        let updated = await inventoryModel.findOneAndUpdate(
            {
                product: productId,
                stock: { $gte: quantity }
            },
            { $inc: { stock: -quantity } },
            { new: true }
        ).populate('product');

        if (updated) {
            return { data: updated };
        }

        let inventory = await inventoryModel.findOne({ product: productId });
        if (!inventory) {
            return { error: { status: 404, message: 'inventory not found' } };
        }

        return { error: { status: 400, message: 'stock is not enough' } };
    },
    Reservation: async function (productId, quantity) {
        let checkProduct = await getActiveProduct(productId);
        if (checkProduct.error) {
            return checkProduct;
        }

        let updated = await inventoryModel.findOneAndUpdate(
            {
                product: productId,
                stock: { $gte: quantity }
            },
            { $inc: { stock: -quantity, reserved: quantity } },
            { new: true }
        ).populate('product');

        if (updated) {
            return { data: updated };
        }

        let inventory = await inventoryModel.findOne({ product: productId });
        if (!inventory) {
            return { error: { status: 404, message: 'inventory not found' } };
        }

        return { error: { status: 400, message: 'stock is not enough' } };
    },
    Sold: async function (productId, quantity) {
        let checkProduct = await getActiveProduct(productId);
        if (checkProduct.error) {
            return checkProduct;
        }

        let updated = await inventoryModel.findOneAndUpdate(
            {
                product: productId,
                reserved: { $gte: quantity }
            },
            { $inc: { reserved: -quantity, soldCount: quantity } },
            { new: true }
        ).populate('product');

        if (updated) {
            return { data: updated };
        }

        let inventory = await inventoryModel.findOne({ product: productId });
        if (!inventory) {
            return { error: { status: 404, message: 'inventory not found' } };
        }

        return { error: { status: 400, message: 'reserved is not enough' } };
    }
};
