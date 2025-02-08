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
    personality: "INSERT INTO PERSONALITY (NAME) VALUES (@name)",
    poketmon_spec: "INSERT INTO LOCAL (POKETMON_ID, SPEC_ID, HIDDEN_YN) VALUES (@poketmon_id, @spec_id, @priority)",
    boilerplate: "INSERT INTO BOILERPLATE (NAME, PAGE, TYPE, TEXT) VALUES (@name, @page, @type, @text)",
    tracejob: "INSERT INTO TRACEJOB (KEY, JOB) VALUES (@key, @job)",
  },
  ignore: {
    spec: "INSERT OR IGNORE INTO SPEC (NAME) VALUES (@name)",
    local: "INSERT OR IGNORE INTO LOCAL (NAME) VALUES (@name)",
    image: "INSERT OR IGNORE INTO IMAGE (PATH) VALUES (@path)",
    type: "INSERT OR IGNORE INTO TYPE (NAME) VALUES (@name)",
    personality: "INSERT OR IGNORE INTO PERSONALITY (NAME) VALUES (@name)",

    poketmon_local: `
        INSERT OR IGNORE INTO POKETMON_LOCAL (POKETMON_ID, LOCAL_ID)
        SELECT POKETMON_ID, LOCAL_ID
        FROM POKETMON, LOCAL
        WHERE POKETMON.NAME = @poketmon_name AND LOCAL.NAME = @local_name
        `,
    poketmon_image: `
        INSERT OR IGNORE INTO POKETMON_IMAGE (POKETMON_ID, IMAGE_ID)
        SELECT POKETMON_ID, IMAGE_ID
        FROM POKETMON, IMAGE
        WHERE POKETMON.NAME = @poketmon_name AND IMAGE.PATH = @image_path
        `,
    poketmon_type: `
        INSERT OR IGNORE INTO POKETMON_TYPE (POKETMON_ID, TYPE_ID)
        SELECT POKETMON_ID, TYPE_ID
        FROM POKETMON, TYPE
        WHERE POKETMON.NAME = @poketmon_name AND TYPE.NAME = @type_name
        `,
    poketmon_personality: `
        INSERT OR IGNORE INTO POKETMON_PERSONALITY (POKETMON_ID, PERSONALITY_ID)
        SELECT POKETMON_ID, PERSONALITY_ID
        FROM POKETMON, PERSONALITY
        WHERE POKETMON.NAME = @poketmon_name AND PERSONALITY.NAME = @personality_name
        `,
    poketmon_spec: `
        INSERT OR IGNORE INTO POKETMON_SPEC (POKETMON_ID, SPEC_ID, PRIORITY)
        SELECT POKETMON_ID, SPEC_ID, @priority PRIORITY
        FROM POKETMON, SPEC
        WHERE POKETMON.NAME = @poketmon_name AND SPEC.NAME = @spec_name
        `,
  },
  replace: {
    local: "INSERT OR REPLACE INTO LOCAL (NAME) VALUES (@name)",
    spec: "INSERT OR REPLACE INTO SPEC (NAME) VALUES (@name)",
    image: "INSERT OR REPLACE INTO IMAGE (PATH) VALUES (@path)",
    type: "INSERT OR REPLACE INTO TYPE (NAME) VALUES (@name)",
    poketmon: `
        INSERT OR REPLACE INTO POKETMON (NAME, LOCAL_ID, IMAGE_ID, TYPE_ID, RARE)
        SELECT @name, LOCAL_ID, IMAGE_ID, TYPE_ID, @rare
        FROM LOCAL, IMAGE, TYPE
        WHERE LOCAL.NAME = @local_name AND IMAGE.PATH = @image_path AND TYPE.NAME = @type_name
        `,
    personality: "INSERT OR REPLACE INTO PERSONALITY (NAME) VALUES (@name)",
    poketmon_local: `
        INSERT OR REPLACE INTO POKETMON_LOCAL (POKETMON_ID, LOCAL_ID)
        SELECT POKETMON.ID, LOCAL.ID
        FROM POKETMON, LOCAL
        WHERE POKETMON.NAME = @poketmon_name AND LOCAL.NAME = @local_name
        `,
    poketmon_image: `
        INSERT OR REPLACE INTO POKETMON_IMAGE (POKETMON_ID, IMAGE_ID)
        SELECT POKETMON.ID, IMAGE.ID
        FROM POKETMON, IMAGE
        WHERE POKETMON.NAME = @poketmon_name AND IMAGE.PATH = @image_path
        `,
    poketmon_type: `
        INSERT OR REPLACE INTO POKETMON_TYPE (POKETMON_ID, TYPE_ID)
        SELECT POKETMON.ID, TYPE.ID
        FROM POKETMON, TYPE
        WHERE POKETMON.NAME = @poketmon_name AND TYPE.NAME = @type_name
        `,
    poketmon_personality: `
        INSERT OR REPLACE INTO POKETMON_PERSONALITY (POKETMON_ID, PERSONALITY_ID)
        SELECT POKETMON.ID, PERSONALITY.ID
        FROM POKETMON, PERSONALITY
        WHERE POKETMON.NAME = @poketmon_name AND PERSONALITY.NAME = @personality_name
        `,
    poketmon_spec: `
        INSERT OR REPLACE INTO POKETMON_SPEC (POKETMON_ID, SPEC_ID, PRIORITY)
        SELECT POKETMON.ID, SPEC.ID SPEC_ID, @priority PRIORITY
        FROM POKETMON, SPEC
        WHERE POKETMON.NAME = @poketmon_name AND SPEC.NAME = @spec_name
        `,
  },
  upsert: {
    poketmon: `
        INSERT INTO POKETMON (NAME, RARE, LEVEL_MAX, LEVEL_MIN, UPDATE_DT)
        VALUES (@name, @rare, @level_max, @level_min, datetime('now','localtime'))
        ON CONFLICT(NAME) DO UPDATE SET
        RARE=@rare, LEVEL_MAX=@level_max, LEVEL_MIN=@level_min, UPDATE_DT=datetime('now','localtime')
        `,
    boilerplate: `
        INSERT INTO BOILERPLATE (NAME, PAGE, TYPE, TEXT, UPDATE_DT)
        VALUES (@name, @page, @type, @text, datetime('now','localtime'))
        ON CONFLICT(NAME) DO UPDATE SET
        PAGE=@page, TYPE=@type, TEXT=@text, UPDATE_DT=datetime('now','localtime')
        `,
    poketmon_local: `
        INSERT INTO POKETMON_LOCAL (POKETMON_ID, LOCAL_ID)
        SELECT POKETMON.ID, LOCAL.ID
        FROM POKETMON, LOCAL
        WHERE POKETMON.NAME = @poketmon_name AND LOCAL.NAME = @local_name
        ON CONFLICT(POKETMON_ID, LOCAL_ID) DO NOTHING
        `,
    poketmon_image: `
        INSERT INTO POKETMON_IMAGE (POKETMON_ID, IMAGE_ID)
        SELECT POKETMON.ID, IMAGE.ID
        FROM POKETMON, IMAGE
        WHERE POKETMON.NAME = @poketmon_name AND IMAGE.PATH = @image_path
        ON CONFLICT(POKETMON_ID, IMAGE_ID) DO NOTHING
        `,
    poketmon_type: `
        INSERT INTO POKETMON_TYPE (POKETMON_ID, TYPE_ID)
        SELECT POKETMON.ID, TYPE.ID
        FROM POKETMON, TYPE
        WHERE POKETMON.NAME = @poketmon_name AND TYPE.NAME = @type_name
        ON CONFLICT(POKETMON_ID, TYPE_ID) DO NOTHING
        `,
    poketmon_personality: `
        INSERT INTO POKETMON_PERSONALITY (POKETMON_ID, PERSONALITY_ID)
        SELECT POKETMON.ID, PERSONALITY.ID
        FROM POKETMON, PERSONALITY
        WHERE POKETMON.NAME = @poketmon_name AND PERSONALITY.NAME = @personality_name
        ON CONFLICT(POKETMON_ID, PERSONALITY_ID) DO NOTHING
        `,
    poketmon_spec: `
        INSERT INTO POKETMON_SPEC (POKETMON_ID, SPEC_ID, PRIORITY)
        SELECT POKETMON.ID, SPEC.ID, @priority
        FROM POKETMON, SPEC
        WHERE POKETMON.NAME = @poketmon_name AND SPEC.NAME = @spec_name
        ON CONFLICT(POKETMON_ID, SPEC_ID) DO UPDATE SET PRIORITY=@priority
        `,
  },
};

module.exports = query;
