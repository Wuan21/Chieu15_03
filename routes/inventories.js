var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventories');
let { InventoryQuantityValidator, validatedResult } = require('../utils/validator');

router.get('/', async function (req, res, next) {
    try {
        let result = await inventoryController.GetAllInventories();
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let result = await inventoryController.GetInventoryById(req.params.id);
        if (!result) {
            return res.status(404).send({ message: 'ID NOT FOUND' });
        }
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

router.post('/add-stock', InventoryQuantityValidator, validatedResult, async function (req, res, next) {
    try {
        let result = await inventoryController.AddStock(req.body.product, req.body.quantity);
        if (result.error) {
            return res.status(result.error.status).send({ message: result.error.message });
        }
        res.send(result.data);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post('/remove-stock', InventoryQuantityValidator, validatedResult, async function (req, res, next) {
    try {
        let result = await inventoryController.RemoveStock(req.body.product, req.body.quantity);
        if (result.error) {
            return res.status(result.error.status).send({ message: result.error.message });
        }
        res.send(result.data);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post('/reservation', InventoryQuantityValidator, validatedResult, async function (req, res, next) {
    try {
        let result = await inventoryController.Reservation(req.body.product, req.body.quantity);
        if (result.error) {
            return res.status(result.error.status).send({ message: result.error.message });
        }
        res.send(result.data);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post('/sold', InventoryQuantityValidator, validatedResult, async function (req, res, next) {
    try {
        let result = await inventoryController.Sold(req.body.product, req.body.quantity);
        if (result.error) {
            return res.status(result.error.status).send({ message: result.error.message });
        }
        res.send(result.data);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
