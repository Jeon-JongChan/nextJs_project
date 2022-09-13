const query = {
    create_table_local: `
    CREATE TABLE LOCAL (
        ID      INT PRIMARY KEY,
        NAME    NVARCHAR(50)
    )
    `,
    create_table_spec: `
    CREATE TABLE SPEC (
        ID      INT PRIMARY KEY,
        NAME    NVARCHAR(20)
    )
    `,
    create_table_image: `
    CREATE TABLE IMAGE (
        ID      INT PRIMARY KEY,
        PATH    VARCHAR(100)
    )
    `,
    create_table_type: `
    CREATE TABLE TYPE (
        ID      INT PRIMARY KEY,
        NAME    NVARCHAR(10)
    )
    `,
    create_table_poketmon: `
    CREATE TABLE POKETMON (
        ID      INT PRIMARY KEY,
        NAME    NVARCHAR(20),
        LOCAL_ID    INT,
        IMAGE_ID    INT,
        TYPE_ID     INT,
        RARE        FLOAT
    )
    `,
    create_table_poketmon_spec: `
    CREATE TABLE POKETMON_SPEC (
        POKETMON_ID INT,
        SPEC_ID     INT,
        HIDDEN_YN   CHAR(1) DEFAULT 'N'
    )
    `,
};

module.exports = query;
