const crypto = require('crypto'); // método crypto

const connection = require('../database/connection'); //conexão com o banco de dados

module.exports = {
    async index(request, response) {
        const ongs = await connection('ongs').select('*'); //selecionar todas as ongs do banco de dados
    
        return response.json(ongs); //retornar as ongs listadas
    },

    async create(request, response) {
        const { name, email, whatsapp, city, uf } = request.body;

        const id = crypto.randomBytes(4).toString('HEX'); // gera um id de 4B em hexadecimal

         await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        });

        return response.json({ id });
    }
}