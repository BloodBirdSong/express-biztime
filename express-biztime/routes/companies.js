const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");



router.post('/', async (req, res, next) => {
    try {
        const company = req.body;
        
        const query = 'INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING *'
        const values = company.companies

        const results = await db.query(query, values)
        console.log(results.rows[0])
        return res.json({ companies: results.rows[0] })
    } catch (e) {
        return next(e);
    }
})

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ users: results.rows })
    } catch (e) {
        return next(e);
    }
})




router.patch('/:code', async (req, res, next) => {
    try {
        const company = req.body;

        const query = 'UPDATE companies SET code=$1, name=$2, description=$3 WHERE code=$1 RETURNING code, name, description'
        const values = company.companies
        const results = await db.query(query, values)
        return res.json({ companies: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code = $1', [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find companie with code of ${code}`, 404)
        }
        return res.send({ companies: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])
        return res.send({ msg: "DELETED!" })
    } catch (e) {
        return next(e)
    }
})









module.exports = router;
