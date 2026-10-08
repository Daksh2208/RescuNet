import { prisma } from "../config/prisma.js";
export const me = async (req, res) => {
    const id = req.user.id;
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        },
    });
    res.json({
        success: true,
        user,
        data: user,
    });
};
//# sourceMappingURL=user.controller.js.map