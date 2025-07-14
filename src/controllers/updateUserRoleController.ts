import {Request, Response} from 'express';
import {updateUserRoleService} from "../services/updateUserRoleService";

const updateUserRole = async (req: Request, res: Response) => {
    const {newRole, email} = req.body;
    await updateUserRoleService.updateRole({newRole, email});
    res.status(200).json({ message: `User role updated successfully to ${newRole}.` });
}

export const updateUserRoleController = {
    updateUserRole,
}