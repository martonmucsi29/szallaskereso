import pool from '../utils/db.js';
import { Router } from 'express';

const varrouter = Router();

varrouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const {minSzallas} = req.query;

    if(minSzallas){
        params.push(minSzallas);
        szurok.push(`HAVING COUNT(szallasok.varos_id) >= ?`);
    }

    let sql = `SELECT varosok.id, varosok.nev, varosok.orszag, COUNT(szallasok.varos_id) AS szallasDb, MIN(szallasok.ar) AS legolcsobb, ROUND(AVG(szallasok.ar), 0) AS atlagAr FROM varosok LEFT JOIN szallasok ON szallasok.varos_id = varosok.id GROUP BY varosok.nev`;

    if (szurok.length > 0) {
        sql += ` ${szurok}`;
    }

    sql += ` ORDER BY varosok.nev`;

    try{
        let [eredmeny] = await pool.query(sql, params);
        res.json(eredmeny);
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }

});

varrouter.get('/:id/szallasok', async (req, res) => {
    const {id} = req.params;

    try{
        let sql = `SELECT szallasok.id, szallasok.nev, varosok.nev, varosok.orszag FROM szallasok LEFT JOIN varosok ON varosok.id = szallasok.varos_id WHERE szallasok.varos_id = ?`
        let [eredmeny] = await pool.query(sql, id);

        if(id >= 7){
            return res.status(404).json({hiba: "A megadott id nem található!"});
        }
        res.json(eredmeny);
    }

    
    catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
})

export default varrouter;