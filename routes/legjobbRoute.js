import pool from '../utils/db.js';
import { Router } from 'express';

const legrouter = Router();

legrouter.get('/:amount', async (req, res) => {
    const {amount} = req.params;

    let sql = `SELECT nev FROM szallasok ORDER BY ertekeles DESC LIMIT ${amount}`;

    try{
        let [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    }catch (error) {
        console.error(error);
        res.status(500).json({hiba: 'Hiba az adatbázis lekérdezése során'});
    }

})

export default legrouter;