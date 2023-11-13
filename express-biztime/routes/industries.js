const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const slugify = require('slugify')



router.post('/', async (req, res, next) => {
    try {
        const industrie = req.body;
        // industrie.industries[0] = slugify(industrie.industries[0], { lower: true, trim: true })
        const query = 'INSERT INTO industries(code, name) VALUES($1, $2) RETURNING *'
        const values = industrie.industries

        const results = await db.query(query, values)
        console.log(results.rows[0])
        return res.json({ industries: results.rows[0] })
    } catch (e) {
        return next(e);
    }
})

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM industries`);
        return res.json({ users: results.rows })
    } catch (e) {
        return next(e);
    }
})




router.patch('/:code', async (req, res, next) => {
    try {
        const industrie = req.body;
        industrie.industries[0] = slugify(industrie.industries[0],{lower: true, trim: true})        
        const query = 'UPDATE industries SET code=$1, name=$2 WHERE code=$1 RETURNING code, name'
        const values = industrie.industries
        const results = await db.query(query, values)
        return res.json({ industries: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('SELECT * FROM industries WHERE code = $1', [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find companie with code of ${code}`, 404)
        }
        return res.send({ industries: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM industries WHERE code = $1', [req.params.code])
        return res.send({ msg: "DELETED!" })
    } catch (e) {
        return next(e)
    }
})




module.exports = router;
