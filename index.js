import 'dotenv/config';
import express from 'express';
import szallasokroute from './routes/szallasRoute.js';
import varosroute from './routes/varosRoute.js';
import orrouter from './routes/orszagRoute.js';
import ajanlatrouter from './routes/ajanlatRoute.js';
import legrouter from './routes/legjobbRoute.js';

const app = express();
app.use(express.json());

let vegpontok = [
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/szallasok`, leiras: 'Szállások listája' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/varosok`, leiras: 'Városok listája' },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/orszagok`, leirás: 'Országok szerint a szállások'},
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/ajanlat`, leirás: 'Város szerinti ár kalkulátor'},
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/legjobb`, leirás: 'A legjobb szállások lekérdezése'}
]

const PORT = Number(process.env.PORT ?? 3000);

app.use('/szallasok', szallasokroute);
app.use('/varosok', varosroute);
app.use('/orszagok', orrouter);
app.use('/ajanlat', ajanlatrouter);
app.use('/legjobb', legrouter);
app.use('/', (req, res) => {
    res.status(404).json(vegpontok);
});

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));