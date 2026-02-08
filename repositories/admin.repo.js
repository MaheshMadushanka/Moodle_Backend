import Admin from "../models/admin.model.js";

const AdminRepo = {
  super_admin_register:  async (
    role_id,
    user_id,
    transaction,
  ) => {
    const result = await Admin.create({
      role_id: role_id,
      user_id: user_id
    }, transaction ? { transaction } : undefined);
    return result;
  },
  registerUser: async (adminData, transaction) => {
    const result = await Admin.create(
      {
        full_name: adminData.full_name,
        phone: adminData.phone,
        address: adminData.address,
        dob: adminData.dob,
        nic: adminData.nic,
        role_id: adminData.role_id,
        user_id: adminData.user_id,
      },
      transaction ? { transaction } : undefined
    );
    return result;
  },
  getAllAdmin: async () => {
    const result = await Admin.findAll();
    return result;
  },

  getAdminById: async (id, transaction) => {
    const result = await Admin.findAll({
      where: {
        id: id,
      },
      ...(transaction ? { transaction } : {}),
    });
    return result;
  },

  deleteAdminById: async (id, transaction) => {
    const result = await Admin.destroy({
      where: {
        id: id,
      },
      ...(transaction ? { transaction } : {}),
    });
    return result;
  },

  updateAdminById: async (id, updateData, transaction) => {
    const result = await Admin.update(
      {
        full_name: updateData.full_name,
        phone: updateData.phone,
        address: updateData.address,
        dob: updateData.dob,
        nic: updateData.nic,
        role_id: updateData.role_id,
      },
      {
        where: {
          id: id,
        },
        ...(transaction ? { transaction } : {}),
      }
    );
    return result;
  },
  
updateAccountStatusById: async (id, status, transaction) => {
    const result = await Admin.update(
      {
        account_status: status,
      },
      {
        where: {
          id: id,
        },
        ...(transaction ? { transaction } : {}),
      }
    );
    return result;
  },
};
export default AdminRepo;