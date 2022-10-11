const query = {
    count_local: "SELECT COUNT(*) CNT FROM LOCAL",
    count_spec: "SELECT COUNT(*) CNT FROM SPEC",
    count_poketmon: "SELECT COUNT(*) CNT FROM POKETMON",
    alldata_local: "SELECT * FROM LOCAL",
    alldata_spec: "SELECT * FROM SPEC",
    alldata_poketmon: "SELECT * FROM POKETMON",
};

module.exports = query;
