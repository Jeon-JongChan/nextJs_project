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
    },
    truncate: {
        local: "DELETE FROM LOCAL",
        spec: "DELETE FROM SPEC",
        image: "DELETE FROM IMAGE",
        type: "DELETE FROM TYPE",
        poketmon: "DELETE FROM POKETMON",
        poketmon_spec: "DELETE FROM POKETMON_SPEC",
        poketmon_image: "DELETE FROM POKETMON_IMAGE",
        poketmon_local: "DELETE FROM POKETMON_LOCAL",
        personality: "DELETE FROM PERSONALITY",
        poketmon_personality: "DELETE FROM POKETMON_PERSONALITY",
    },
    delete_poketmon: "DELETE FROM POKETMON WHERE NAME='피카츄'",
};

module.exports = query;
