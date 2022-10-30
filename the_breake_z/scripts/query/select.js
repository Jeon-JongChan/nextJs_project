const query = {
    count_local: "SELECT COUNT(*) CNT FROM LOCAL",
    count_spec: "SELECT COUNT(*) CNT FROM SPEC",
    count_poketmon: "SELECT COUNT(*) CNT FROM POKETMON",
    status_local: "SELECT COUNT(*) CNT, MAX(ID) LASTID FROM LOCAL",
    status_spec: "SELECT COUNT(*) CNT, MAX(ID) LASTID FROM SPEC",
    status_poketmon: "SELECT COUNT(*) CNT, MAX(ID) LASTID FROM POKETMON",
    alldata_spec: "SELECT * FROM SPEC",
    alldata_poketmon: "SELECT * FROM POKETMON",
};

module.exports = query;
