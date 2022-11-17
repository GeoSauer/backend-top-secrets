const { Router } = require('express');
const Secret = require('../models/Secret.js');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const newSecret = await Secret.insert(req.body);
      res.json(newSecret);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const secrets = await Secret.getAll;
      res.json(secrets);
    } catch (error) {
      next(error);
    }
  });
