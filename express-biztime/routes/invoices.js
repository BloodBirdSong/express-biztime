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

//["100","True"]
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const invoiceCheck = await db.query('SELECT * FROM invoices WHERE id=$1', [id])
        if (invoiceCheck.rows.length == 0){
            throw new ExpressError(`Can't find companie with code of ${code}`, 404)

        }
        const invoice = req.body;
        const query = 'UPDATE invoices SET amt=$1, paid=$2,paid_date=$4 WHERE id=$3 RETURNING *'
        // const query = 'UPDATE companies SET code=$1, name=$2, description=$3 WHERE code=$1 RETURNING code, name, description'
        let values = invoice
        values.push(id, new Date().toISOString().slice(0, 19).replace('T', ' '))
        const results = await db.query(query, values)
        return res.json({ invoices: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})







module.exports = router;
