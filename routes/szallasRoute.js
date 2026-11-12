import pool from '../utils/db.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    let sql = `SELECT szallasok.id, szallasok.nev, varosok.nev, varosok.orszag, csillag, ar, CASE WHEN medence = 0 THEN "false" WHEN medence = 1 THEN "true" END AS medence, ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id`;

    const {varos, minCsillag, maxAr, medence} = req.query;

    if(minCsillag > 5){
        return res.status(400).send({hiba: "Legfeljebb 5 csillagos értékelésű szállásokra kereshet!"});
    }
    if (medence !== undefined && medence !== "true" && medence !== "false") {
        return res.status(400).json({ hiba: "A medencét true vagy false értékkel adhatja meg!"});
    }

    if(varos){
        params.push(varos);
        szurok.push(`varosok.nev = ?`);
    }
    if(minCsillag){
        params.push(minCsillag);
        szurok.push(`szallasok.csillag >= ?`);
    }
    if(maxAr){
        params.push(maxAr);
        szurok.push(`szallasok.ar <= ?`);
    }
    if(medence){
        params.push(medence === "true" ? 1 : 0);
        szurok.push(`medence = ?`);
    }

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    sql += ` ORDER BY szallasok.ar ASC`;

    let eredmeny = await pool.query(sql, params);
    res.json(eredmeny);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;

    if (isNaN(id) || id < 1) {
        return res.status(400).json({hiba: 'Érvénytelen azonosító!'});
    }

    let sql = `SELECT szallasok.id, szallasok.nev, varosok.nev, varosok.orszag, csillag, ar, CASE WHEN medence = 0 THEN "false" WHEN medence = 1 THEN "true" END AS medence, ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id WHERE szallasok.id = ? ORDER BY szallasok.ar ASC`;
    
    try {
        const [eredmeny] = await pool.query(sql, id);

        if (eredmeny.length === 0) {
            return res.status(404).json({hiba: 'Nincs ilyen szállás!'});
        }
        res.json(eredmeny[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
})


export default router;