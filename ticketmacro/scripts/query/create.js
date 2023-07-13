const query = {
    create_table_sse: `
        CREATE TABLE IF NOT EXISTS SSE (
            ID      INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME    TEXT NOT NULL,
            MSG     TEXT NOT NULL
        )
    `,
};

module.exports = query;
//ID      INTEGER PRIMARY KEY AUTOINCREMENT,
// FOREIGN KEY (POKETMON_ID) REFERENCES POKETMON (ID) ON DELETE CASCADE
