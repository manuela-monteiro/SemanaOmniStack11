const connection = require('../database/connection'); //conexão com o banco de dados

module.exports = {
    async index(request, response) {
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count(); // armazena o total de casos da ong

        console.log(count);

        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id') //
        .limit(5)
        .offset((page -1) * 5)
        .select(['incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
        ]);

        //selecionar todo os casos do banco de dados

        response.header('X-Total-Count', count[ 'count(*)' ]);

        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        
        //verificar se a ong que demanda deletar o caso é a mesma que adicionou-o
        
        if (incident.ong_id !== ong_id) {
            return response.status(401).jason({ error: 'operation not permitted' });

            // retornar resposta de erro caso a ong que tenta deletar o caso não seja a que o adicionou
        }

        await connection('incidents').where('id', id).delete(); // deletar o caso

        return response.status(204).send(); //retornar status no content
    }
}