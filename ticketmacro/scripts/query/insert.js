const query = {
    insert: {
        sse: "INSERT INTO SSE (NAME, MESSAGE) VALUES (@name, @message)",
        macro: "INSERT INTO MACRO (SSE, SITE, TICKETDATE, START_DT, URL) VALUES (@sse, @site, @ticketdate, @start_dt, @url)",
    },
    ignore: {
        poketmon_local: `
        INSERT OR IGNORE INTO POKETMON_LOCAL (POKETMON_ID, LOCAL_ID)
        SELECT POKETMON_ID, LOCAL_ID
        FROM POKETMON, LOCAL
        WHERE POKETMON.NAME = @poketmon_name AND LOCAL.NAME = @local_name
        `,
    },
    replace: {
        poketmon: `
        INSERT OR REPLACE INTO POKETMON (NAME, LOCAL_ID, IMAGE_ID, TYPE_ID, RARE)
        SELECT @name, LOCAL_ID, IMAGE_ID, TYPE_ID, @rare
        FROM LOCAL, IMAGE, TYPE
        WHERE LOCAL.NAME = @local_name AND IMAGE.PATH = @image_path AND TYPE.NAME = @type_name
        `,
    },
    upsert: {
        poketmon: `
        INSERT INTO POKETMON (NAME, RARE, LEVEL_MAX, LEVEL_MIN, UPDATE_DT)
        VALUES (@name, @rare, @level_max, @level_min, datetime('now','localtime'))
        ON CONFLICT(NAME) DO UPDATE SET
        RARE=@rare, LEVEL_MAX=@level_max, LEVEL_MIN=@level_min, UPDATE_DT=datetime('now','localtime')
        `,
    },
};

module.exports = query;
