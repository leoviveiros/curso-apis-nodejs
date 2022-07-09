import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const HeroisSchema = new Schema({
    nome: { type: String, required: true },
    poder: { type: String, required: true },
    insertedAt: { type: Date, default: new Date() }
});


export const HeroisModel = model('heroes', HeroisSchema);
 
