import { prisma } from "./config/prisma.js";
import { comparePassword, hashPassword } from "./utils/hash.js";
async function test() {
    const user = await prisma.user.findFirst({
        where: { email: "admin@gmail.com" }
    });
    console.log("Found admin user:", user?.email, user?.role);
    if (user) {
        console.log("Password hash starts with:", user.password.slice(0, 10));
        // Test if password might be 'admin123' or 'password' or similar
        const test1 = await comparePassword("admin123", user.password);
        console.log("Matches 'admin123':", test1);
    }
}
test()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=test_hash.js.map