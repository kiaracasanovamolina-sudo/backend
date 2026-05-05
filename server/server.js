import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import indexRoutes from '../routes/index.routes.js';
import * as db from '../db/cnn_mongodb.js';

export default class Server {
    constructor() {
       this.app = express();
       this.port = process.env.PORT || 3000;
       this.generalRoutes = '/api/';
       this.conectarDB(); 
       //Middleware
       this.middleware();
       //Rutas
       this.routes();
    }

    async conectarDB() {
        if (!db.isConected) {
            await db.conectarMongoDB();
        }
    }

    middleware() {
        //cors
        this.app.use(cors());
        //lectura y parseo del body
        this.app.use(bodyParser.json());
        //directorio publico
        this.app.use(express.static('public'));
    } 
    routes() {
        //localhost:3000/api/ejemplo
        this.app.use(this.generalRoutes, indexRoutes);
        // 404 - Ruta no encontrada
        this.app.use((req, res) => {
            res.status(404).send('Página no encontrada');
        });
    }  
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port.yellow);
        });
    } 
}       
