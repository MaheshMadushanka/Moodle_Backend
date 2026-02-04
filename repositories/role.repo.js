import Role from "../models/role.model.js";

const RoleRepo = {
    create: async (position) => {
        try {

            const result = await Role.create({
                position: position
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    findByPosition: async (position) => {
        try {
            return await Role.findOne({
                where: {
                    position: position,
                },
            });
        } catch (error) {
            throw error;
        }
    },

    findOrCreateByPosition: async (position, transaction) => {
        try {
            const [role] = await Role.findOrCreate({
                where: { position },
                defaults: { position },
                ...(transaction ? { transaction } : {}),
            });
            return role;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await Role.findOne({
                where: {
                    id: id,
                },

            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const result = await Role.findAll({
            });
            return result;
        } catch (err) {
            throw err;
        }
    },

    updateById: async (id, position) => {
        try {
            const result = await Role.update({
                position: position,
            }, {
                where: {
                    id: id
                }
            });
            return result[0];
        } catch (err) {
            throw err;
        }
    },

    deleteById: async (id) => {
        try {
            const result = await Role.destroy({
                where: {
                    id: id,
                },

            });
            return result;
        } catch (err) {
            throw err;
        }
    }
}


export default RoleRepo;