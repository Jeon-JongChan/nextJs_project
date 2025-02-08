const query = {
    create_table_sse: `
        CREATE TABLE IF NOT EXISTS SSE (
            ID      INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME    TEXT NOT NULL,
            MESSAGE     TEXT NOT NULL
        )
    `,
    create_table_macro: `
        CREATE TABLE IF NOT EXISTS MACRO (
            ID          INTEGER PRIMARY KEY AUTOINCREMENT,
            SSE         VARCHAR(20),
            SITE        VARCHAR(20),
            TICKETDATE  VARCHAR(10),
            START_DT    DATETIME,
            URL         TEXT NOT NULL UNIQUE
        )
    `,
};
//IF NOT EXISTS
module.exports = query;
//ID      INTEGER PRIMARY KEY AUTOINCREMENT,
// FOREIGN KEY (POKETMON_ID) REFERENCES POKETMON (ID) ON DELETE CASCADE
