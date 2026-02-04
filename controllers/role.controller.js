import RoleService from "../services/role.service.js";

const RoleController = {
  create: async (req, res) => {
    try {
      const { position } = req.body;

      const result = await RoleService.create(position);

      if (result.status) {
        res.status(201).json({
          response_code: 200,
          status: true,
          message: 'Role added successfully!',
          result: result.result
        });
      } else {
        res.status(400).json({
          response_code: 400,
          status: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        error: error,
        status: false,
        message: 'Error occurred while saving role!'
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await RoleService.getAll();
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Roles not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Roles fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching role!'
      });
    }
  },

  deleteById: async (req, res) => {
    const id = req.params.id;

    try {
      const result = await RoleService.deleteById(id);

      if (result == 1) {
        res.status(200).json({
          response_code: 200,
          status: true, message: 'Role deleted successfully!'
        });
      } else {
        res.status(404).json({
          response_code: 404,
          status: false, message: 'Role not found!'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while deleting role!'
      });

    }
  },

  findById: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await RoleService.findById(id);
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Role not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Role fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching role!'
      });
    }
  },

  updateById: async (req, res) => {
    const id = req.params.id;
    const { position } = req.body;
    try {
      const result = await RoleService.updateById(id,position);
      if (result == 0) {
        res.status(404).json({ response_code: 404, status: false, message: 'Role not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Role update successfully!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching emoji!'
      });
    }
  },
}

export default RoleController;