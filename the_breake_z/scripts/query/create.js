const query = {
  create_table_local: `
    CREATE TABLE IF NOT EXISTS LOCAL (
        ID      INTEGER PRIMARY KEY,
        NAME    NVARCHAR(50) UNIQUE NOT NULL
    )
    `,
  create_table_spec: `
    CREATE TABLE IF NOT EXISTS SPEC (
        ID      INTEGER PRIMARY KEY,
        NAME    NVARCHAR(20) UNIQUE NOT NULL
    )
    `,
  create_table_personality: `
    CREATE TABLE IF NOT EXISTS PERSONALITY (
        ID      INTEGER PRIMARY KEY,
        NAME    NVARCHAR(20) UNIQUE NOT NULL
    )
    `,
  create_table_image: `
    CREATE TABLE IF NOT EXISTS IMAGE (
        ID      INTEGER PRIMARY KEY,
        PATH    VARCHAR(100) UNIQUE NOT NULL
    )
    `,
  create_table_type: `
    CREATE TABLE IF NOT EXISTS TYPE (
        ID      INTEGER PRIMARY KEY,
        NAME    NVARCHAR(10) UNIQUE NOT NULL
    )
    `,
  create_table_poketmon: `
    CREATE TABLE IF NOT EXISTS POKETMON (
        ID      INTEGER PRIMARY KEY,
        NAME    NVARCHAR(20) UNIQUE NOT NULL,
        RARE        FLOAT,
        LEVEL_MAX   INTEGER,
        LEVEL_MIN   INTEGER,
        UPDATE_DT   TEXT DEFAULT (datetime('now','localtime'))
    )
    `,
  create_table_poketmon_spec: `
    CREATE TABLE IF NOT EXISTS POKETMON_SPEC (
        POKETMON_ID INTEGER NOT NULL,
        SPEC_ID     INTEGER NOT NULL,
        PRIORITY    INTEGER NOT NULL,
        FOREIGN KEY (POKETMON_ID) REFERENCES POKETMON (ID) ON DELETE CASCADE
        UNIQUE(POKETMON_ID, PRIORITY)
    )
    `,
  create_table_poketmon_image: `
    CREATE TABLE IF NOT EXISTS POKETMON_IMAGE (
        POKETMON_ID INTEGER NOT NULL,
        IMAGE_ID    INTEGER NOT NULL,
        FOREIGN KEY (POKETMON_ID) REFERENCES POKETMON (ID) ON DELETE CASCADE
        UNIQUE(POKETMON_ID)
    )
    `,
  create_table_poketmon_local: `
    CREATE TABLE IF NOT EXISTS POKETMON_LOCAL (
        POKETMON_ID INTEGER NOT NULL,
        LOCAL_ID    INTEGER NOT NULL,
        FOREIGN KEY (POKETMON_ID) REFERENCES POKETMON (ID) ON DELETE CASCADE
        UNIQUE(POKETMON_ID)
    )
    `,
  create_table_poketmon_personality: `
    CREATE TABLE IF NOT EXISTS POKETMON_PERSONALITY (
        POKETMON_ID INTEGER NOT NULL,
        PERSONALITY_ID INTEGER NOT NULL,
        FOREIGN KEY (POKETMON_ID) REFERENCES POKETMON (ID) ON DELETE CASCADE
        UNIQUE(POKETMON_ID)
    )
    `,
  create_table_boilerplate: `
    CREATE TABLE IF NOT EXISTS BOILERPLATE (
        ID      INTEGER PRIMARY KEY,
        NAME    NVARCHAR(20) UNIQUE NOT NULL,
        PAGE    NVARCHAR(20) NOT NULL,
        TYPE    NVARCHAR(20) NOT NULL,
        TEXT    NVARCHAR(1000) NOT NULL,
        UPDATE_DT   TEXT DEFAULT (datetime('now','localtime'))
    )
    `,
  create_table_tracejobs: `
    CREATE TABLE IF NOT EXISTS TRACEJOBS (
        KEY     VARCHAR(64),
        JOB     VARCHAR(100)
    )
    `,
  create_table_side: `
    CREATE TABLE IF NOT EXISTS SIDE (
        NAME    VARCHAR(64) PRIMARY KEY,
        TEXT    VARCHAR(1000)
    )
    `,
};

module.exports = query;
//ID      INTEGER PRIMARY KEY AUTOINCREMENT,
// FOREIGN KEY (POKETMON_ID) REFERENCES POKETMON (ID) ON DELETE CASCADE
