import { prisma } from "./config/prisma.js";
async function main() {
    console.log("Testing connection...");
    const count = await prisma.user.count();
    console.log("User count in DB:", count);
    const users = await prisma.user.findMany({ select: { email: true, role: true, isActive: true } });
    console.log("Users:", users);
}
main()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=test_prisma.js.map