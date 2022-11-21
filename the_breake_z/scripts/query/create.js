const query = {
    create_table_local: `
    CREATE TABLE LOCAL (
        ID      INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME    NVARCHAR(50)
    )
    `,
    create_table_spec: `
    CREATE TABLE SPEC (
        ID      INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME    NVARCHAR(20)
    )
    `,
    create_table_image: `
    CREATE TABLE IMAGE (
        ID      INTEGER PRIMARY KEY AUTOINCREMENT,
        PATH    VARCHAR(100)
    )
    `,
    create_table_type: `
    CREATE TABLE TYPE (
        ID      INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME    NVARCHAR(10)
    )
    `,
    create_table_poketmon: `
    CREATE TABLE POKETMON (
        ID      INTEGER PRIMARY KEY AUTOINCREMENT,
        NAME    NVARCHAR(20) UNIQUE,
        RARE        FLOAT,
        LEVEL_MAX   INTEGER,
        LEVEL_MIN   INTEGER
    )
    `,
    create_table_poketmon_spec: `
    CREATE TABLE POKETMON_SPEC (
        POKETMON_ID INTEGER,
        SPEC_ID     INTEGER,
        PRIORITY    INTEGER
    )
    `,
};

module.exports = query;
