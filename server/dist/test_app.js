import app from "./app.js";
import { env } from "./config/env.js";
const server = app.listen(env.PORT, () => {
    console.log(`🚀 Server successfully listening at http://localhost:${env.PORT}`);
    setTimeout(() => {
        server.close();
        process.exit(0);
    }, 3000);
});
//# sourceMappingURL=test_app.js.map