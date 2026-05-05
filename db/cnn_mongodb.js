import mongoose from 'mongoose';

let isConected = false;

const conectarMongoDB = async () => {
    if (isConected) {
        console.log('Ya estás conectado a MongoDB'.green);
        return;
    }

    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/backend';
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI no definida. Usando MongoDB local: mongodb://127.0.0.1:27017/backend'.yellow);
    }

    try {
        await mongoose.connect(uri);
        isConected = true;
        console.log('Conexión a MongoDB exitosa'.green);
    } catch (error) {
        console.error('Error al conectar a MongoDB'.red, error);
    }
};

const db = mongoose.connection;
db.on('error', (error) => {
    isConected = false;
    console.error('Error en la conexión a MongoDB'.red, error);
});

db.once('open', () => {
    isConected = true;
});

db.on('disconnected', () => {
    isConected = false;
    console.warn('Conexión a MongoDB perdida'.yellow);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Desconectado de MongoDB'.yellow);
    process.exit(0);
});

export { conectarMongoDB, isConected };