const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");


// if its in companies db then it can be made in invoices
router.post('/', async (req, res, next) => {
    try {
        const invoice = req.body;

        const query = 'INSERT INTO invoices(comp_code, amt, paid, add_date, paid_date ) VALUES($1, $2, $3, $4, $5) RETURNING *'
        const values = invoice.invoices

        const results = await db.query(query, values)
        return res.json({ invoices: results.rows[0] })
    } catch (e) {
        return next(e);
    }
})

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows })
    } catch (e) {
        return next(e);
    }
})




router.patch('/:comp_code', async (req, res, next) => {
    try {
        const invoice = req.body;

        const query = 'UPDATE invoices SET comp_code=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5 WHERE comp_code=$1 RETURNING comp_code, amt, paid, add_date, paid_date'
        const values = invoice.invoices
        const results = await db.query(query, values)
        return res.json({ invoices: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.get('/:comp_code', async (req, res, next) => {
    try {
        const { comp_code } = req.params;
        const results = await db.query('SELECT * FROM invoices WHERE comp_code = $1', [comp_code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find companie with comp_code of ${comp_code}`, 404)
        }
        return res.send({ invoices: results.rows })
    } catch (e) {
        return next(e)
    }
})

router.delete('/:comp_code', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM invoices WHERE comp_code = $1', [req.params.comp_code])
        return res.send({ msg: "DELETED!" })
    } catch (e) {
        return next(e)
    }
})









module.exports = router;
