const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const slugify = require('slugify')



router.post('/', async (req, res, next) => {
    try {
        const corprate = req.body;
        // corprate.enterprise[0] = slugify(corprate.enterprise[0], { lower: true, trim: true })
        const query = 'INSERT INTO enterprise(comp_code, ind_code) VALUES($1, $2) RETURNING *'
        const values = corprate.enterprise

        const results = await db.query(query, values)
        console.log(results.rows[0])
        return res.json({ enterprise: results.rows[0] })
    } catch (e) {
        return next(e);
    }
})

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM enterprise`);
        return res.json({ users: results.rows })
    } catch (e) {
        return next(e);
    }
})




router.patch('/:ind_code', async (req, res, next) => {
    try {
        const corprate = req.body;
        corprate.enterprise[0] = slugify(corprate.enterprise[0],{lower: true, trim: true})        
        const query = 'UPDATE enterprise SET ind_code=$1, comp_code=$2 WHERE ind_code=$1 RETURNING ind_code, comp_code'
        const values = corprate.enterprise
        const results = await db.query(query, values)
        return res.json({ enterprise: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.get('/:ind_code', async (req, res, next) => {
    try {
        const { ind_code } = req.params;
        const results = await db.query('SELECT * FROM enterprise WHERE ind_code = $1', [ind_code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find companie with ind_code of ${ind_code}`, 404)
        }
        return res.send({ enterprise: results.rows })
    } catch (e) {
        return next(e)
    }
})

router.delete('/:ind_code', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM enterprise WHERE ind_code = $1', [req.params.ind_code])
        return res.send({ msg: "DELETED!" })
    } catch (e) {
        return next(e)
    }
})




module.exports = router;
