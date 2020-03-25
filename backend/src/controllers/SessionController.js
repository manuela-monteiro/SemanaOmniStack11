const connection = require('../database/connection');

// criar sessão/ fazer login

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        const ong = await connection('ongs')
            .where('id', id)
            .select('name')
            .first();

        if (!ong) {
            return response.status(400).json({ error: 'No ONG found with this ID' });

            // caso não haja ong com o id informado, rejeitar o acesso e devolver uma mensagem de erro
        }

        return response.json(ong); // caso o id exista no banco de dados, retornar um JSON com os dados da ONG referente
    }
}