import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { initDb } from './services/databaseService.js';
import { registerApi } from './routes/api.js';

const app = Fastify({ logger:true, bodyLimit:25*1024*1024 });
const origins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5500').split(',');
await app.register(cors,{origin:origins,methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS']});
await app.register(multipart,{limits:{fileSize:20*1024*1024,files:2}});
await initDb();
await registerApi(app);

const port=Number(process.env.PORT??3000); const host=process.env.HOST??'0.0.0.0';
await app.listen({port,host});
