import "./src/config/env.js";

import app from "./src/app.js";
import ConnectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

//Connect DB:
await ConnectDB();

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})