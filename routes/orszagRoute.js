import pool from '../utils/db.js';
import { Router } from 'express';

const orrouter = Router();

orrouter.get('/', async (req, res) => {
    let sql = `SELECT varosok.orszag, COUNT(DISTINCT varosok.nev) AS varosDb, COUNT(szallasok.varos_id) AS szallasDb, ROUND(AVG(szallasok.ertekeles), 2) AS atlagErtekeles FROM varosok LEFT JOIN szallasok ON szallasok.varos_id = varosok.id GROUP BY varosok.orszag;`
    try{
        let [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
})

export default orrouter;