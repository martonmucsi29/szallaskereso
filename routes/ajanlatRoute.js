import pool from '../utils/db.js';
import { Router } from 'express';

const ajanlatrouter = Router();

ajanlatrouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];
    let hibak = [];

    const {varos, ej, fo} = req.query;

    let sql = `SELECT szallasok.nev, szallasok.csillag, ar AS arFoEj FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id`;

    if (!varos || !ej || !fo) {
        hibak.push(varos, ej, fo);
        return res.status(400).json({ hiba: hibak });
    }

    if(ej && fo){
        params.push(ej, fo);
        sql = `SELECT szallasok.nev, szallasok.csillag, ar AS arFoEj, ROUND(((ar * ?) * ?), 0) AS osszesen FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id`;
    }

    if(varos){
        params.push(varos);
        szurok.push(`varosok.nev = ?`);
    }

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    try{
        let [eredmeny] = await pool.query(sql, params);
        if (eredmeny.length === 0) {
            return res.status(404).json({hiba: 'A megadott városban nincs szállás!'});
        }
        res.json(
            {"varos": varos,
            "ej": ej,
            "fo": fo,
            eredmeny}
        );        
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }
});

export default ajanlatrouter;