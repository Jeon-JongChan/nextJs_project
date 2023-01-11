const query = {
    drop: {
        local: "DROP TABLE LOCAL",
        spec: "DROP TABLE SPEC",
        image: "DROP TABLE IMAGE",
        type: "DROP TABLE TYPE",
        poketmon: "DROP TABLE POKETMON",
        poketmon_spec: "DROP TABLE POKETMON_SPEC",
        poketmon_image: "DROP TABLE POKETMON_IMAGE",
        poketmon_local: "DROP TABLE POKETMON_LOCAL",
        personality: "DROP TABLE PERSONALITY",
        poketmon_personality: "DROP TABLE POKETMON_PERSONALITY",
        boilerplate: "DROP TABLE BOILERPLATE",
    },
    truncate: {
        local: "DELETE FROM LOCAL",
        spec: "DELETE FROM SPEC",
        image: "DELETE FROM IMAGE",
        personality: "DELETE FROM PERSONALITY",
        type: "DELETE FROM TYPE",
        poketmon: "DELETE FROM POKETMON",
        poketmon_spec: "DELETE FROM POKETMON_SPEC",
        poketmon_image: "DELETE FROM POKETMON_IMAGE",
        poketmon_local: "DELETE FROM POKETMON_LOCAL",
        poketmon_personality: "DELETE FROM POKETMON_PERSONALITY",
        boilerplate: "DELETE FROM BOILERPLATE",
    },
    delete: {
        poketmon: "DELETE FROM POKETMON WHERE NAME=@name",
        local: "DELETE FROM LOCAL WHERE NAME=@name",
        spec: "DELETE FROM SPEC WHERE NAME=@name",
        personality: "DELETE FROM PERSONALITY WHERE NAME=@name",
        image: "DELETE FROM IMAGE WHERE NAME=@name",
        type: "DELETE FROM TYPE WHERE NAME=@name",
        boilerplate: "DELETE FROM BOILERPLATE WHERE NAME=@name",
    },
};

module.exports = query;
