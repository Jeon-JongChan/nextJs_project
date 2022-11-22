const query = {
    insert: {
        local: "INSERT INTO LOCAL (NAME) VALUES (@name)",
        spec: "INSERT INTO SPEC (NAME) VALUES (@name)",
        image: "INSERT INTO IMAGE (PATH) VALUES (@path)",
        type: "INSERT INTO TYPE (NAME) VALUES (@name)",
        poketmon: `
        INSERT INTO POKETMON (NAME, LOCAL_ID, IMAGE_ID, TYPE_ID, RARE) 
        VALUES (@name, @local_id, @image_id, @type_id, @rare)
        `,
        poketmon_spec: "INSERT INTO LOCAL (POKETMON_ID, SPEC_ID, HIDDEN_YN) VALUES (@poketmon_id, @spec_id, @priority)",
    },
    upsert_poketmon: `
    INSERT INTO POKETMON (NAME, RARE, LEVEL_MAX, LEVEL_MIN) 
    VALUES (@name, @rare, @level_max, @level_min)
    ON CONFLICT(NAME) DO UPDATE SET 
    RARE=@rare, LEVEL_MAX=@level_max, LEVEL_MIN=@level_min
    `,
    ignore_spec: `INSERT OR IGNORE INTO SPEC (NAME) VALUES (@name)`,
    ignore_image: `INSERT OR IGNORE INTO IMAGE (PATH) VALUES (@path)`,
    ignore_poketmon_local: `
    INSERT OR IGNORE INTO POKETMON_LOCAL (POKETMON_ID, LOCAL_ID)
    SELECT ( SELECT ID FROM POKETMON WHERE NAME=@poketmon_name ) POKETMON_ID
    , (SELECT ID FROM LOCAL WHERE NAME=@local_name) LOCAL_ID 
    `,
    ignore_poketmon_spec: `
    INSERT OR IGNORE INTO POKETMON_SPEC (POKETMON_ID, SPEC_ID, PRIORITY)
    SELECT ( SELECT ID FROM POKETMON WHERE NAME=@poketmon_name ) POKETMON_ID
    , (SELECT ID FROM SPEC WHERE NAME=@spec_name) SPEC_ID
    , @priority PRIORITY
    `,
    ignore_poketmon_image: `
    INSERT OR IGNORE INTO POKETMON_IMAGE (POKETMON_ID, IMAGE_ID)
    SELECT ( SELECT ID FROM POKETMON WHERE NAME=@poketmon_name ) POKETMON_ID
    , (SELECT ID FROM IMAGE WHERE PATH=@image_path) IMAGE_ID
    `,
};

module.exports = query;
