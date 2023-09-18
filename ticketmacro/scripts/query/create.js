const query = {
    create_table_sse: `
        CREATE TABLE SSE (
            ID      INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME    TEXT NOT NULL,
            MESSAGE     TEXT NOT NULL
        )
    `,
};
//IF NOT EXISTS
module.exports = query;
//ID      INTEGER PRIMARY KEY AUTOINCREMENT,
// FOREIGN KEY (POKETMON_ID) REFERENCES POKETMON (ID) ON DELETE CASCADE
