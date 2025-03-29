const query = {
  count: {
    local: "SELECT COUNT(*) cnt FROM LOCAL",
    spec: "SELECT COUNT(*) cnt FROM SPEC",
    image: "SELECT COUNT(*) cnt FROM IMAGE",
    type: "SELECT COUNT(*) cnt FROM TYPE",
    poketmon: "SELECT COUNT(*) cnt FROM POKETMON",
    boilerplate: "SELECT COUNT(*) cnt FROM BOILERPLATE",
    personality: "SELECT COUNT(*) cnt FROM PERSONALITY",
  },
  status: {
    local: "SELECT COUNT(*) cnt, MAX(ID) lastid FROM LOCAL",
    spec: "SELECT COUNT(*) cnt, MAX(ID) lastid FROM SPEC",
    image: "SELECT COUNT(*) cnt, MAX(ID) lastid FROM IMAGE",
    type: "SELECT COUNT(*) cnt, MAX(ID) lastid FROM TYPE",
    poketmon: "SELECT COUNT(*) cnt, MAX(ID) lastid, MAX(UPDATE_DT) update_dt FROM POKETMON",
    boilerplate: "SELECT COUNT(*) cnt, MAX(ID) lastid, MAX(UPDATE_DT) update_dt FROM BOILERPLATE",
    personality: "SELECT COUNT(*) cnt, MAX(ID) lastid FROM PERSONALITY",
  },
  localdata: {
    local: `
        SELECT NAME, COUNT(LOCAL_ID) POKETMON_CNT
        FROM LOCAL L
        LEFT JOIN POKETMON_LOCAL PL ON PL.LOCAL_ID=L.ID
        GROUP BY ID, NAME
        `,
    spec: `
        SELECT NAME, COUNT(SPEC_ID) POKETMON_CNT
        FROM SPEC L
        LEFT JOIN POKETMON_SPEC PL ON PL.SPEC_ID=L.ID
        GROUP BY ID, NAME
        `,
    personality: `
        SELECT NAME, COUNT(PERSONALITY_ID) POKETMON_CNT
        FROM PERSONALITY P
        LEFT JOIN POKETMON_PERSONALITY PP ON PP.PERSONALITY_ID=P.ID
        GROUP BY ID, NAME
        `,
    poketmon: `
        SELECT NAME, RARE, LEVEL_MAX, LEVEL_MIN
        , (SELECT PATH FROM IMAGE WHERE ID=IMAGE_ID LIMIT 1) PATH
        , (SELECT NAME FROM LOCAL WHERE ID=LOCAL_ID LIMIT 1) LOCAL
        , (SELECT NAME FROM SPEC WHERE ID=SPEC1 LIMIT 1) SPEC1
        , (SELECT NAME FROM SPEC WHERE ID=SPEC2 LIMIT 1) SPEC2
        , (SELECT NAME FROM SPEC WHERE ID=SPEC3 LIMIT 1) SPEC3
        , (SELECT NAME FROM PERSONALITY WHERE ID=PERSONALITY_ID LIMIT 1) PERSONALITY
        FROM (
            SELECT P.NAME, MAX(RARE) RARE, MAX(LEVEL_MAX) LEVEL_MAX, MAX(LEVEL_MIN) LEVEL_MIN
            , MAX(IMAGE_ID) IMAGE_ID, MAX(LOCAL_ID) LOCAL_ID
            , MAX(CASE WHEN PRIORITY=1 THEN PS.SPEC_ID ELSE 0 END) SPEC1
            , MAX(CASE WHEN PRIORITY=2 THEN PS.SPEC_ID ELSE 0 END) SPEC2
            , MAX(CASE WHEN PRIORITY=3 THEN PS.SPEC_ID ELSE 0 END) SPEC3
            , MAX(PERSONALITY_ID) PERSONALITY_ID
            FROM POKETMON P
            LEFT JOIN POKETMON_IMAGE PI ON PI.POKETMON_ID=P.ID
            LEFT JOIN POKETMON_SPEC PS ON PS.POKETMON_ID=P.ID
            LEFT JOIN POKETMON_LOCAL PL ON PL.POKETMON_ID=P.ID
            LEFT JOIN POKETMON_PERSONALITY PP ON PP.POKETMON_ID=P.ID
            GROUP BY P.NAME
        ) A
        `,
    boilerplate: `
        SELECT NAME, PAGE, TYPE, TEXT
        FROM BOILERPLATE
        `,
  },
  alldata: {
    local: "SELECT * FROM LOCAL",
    spec: "SELECT * FROM SPEC",
    image: "SELECT * FROM IMAGE",
    type: "SELECT * FROM TYPE",
    poketmon: "SELECT * FROM POKETMON",
    boilerplate: "SELECT * FROM BOILERPLATE",
    personality: "SELECT * FROM PERSONALITY",
    poketmon_local: "SELECT * FROM POKETMON_LOCAL",
    poketmon_spec: "SELECT * FROM POKETMON_SPEC",
    poketmon_image: "SELECT * FROM POKETMON_IMAGE",
    poketmon_personality: "SELECT * FROM POKETMON_PERSONALITY",
  },
  id: {
    local: "SELECT ID FROM LOCAL WHERE NAME=@name",
    spec: "SELECT ID FROM SPEC WHERE NAME=@name",
    poketmon: "SELECT ID FROM POKETMON WHERE NAME=@name",
    boilerplate: "SELECT ID FROM BOILERPLATE WHERE NAME=@name",
    personality: "SELECT ID FROM PERSONALITY WHERE NAME=@name",
  },
  one: {
    side: "SELECT TEXT FROM SIDE WHERE NAME='battle'",
  },
};

module.exports = query;
