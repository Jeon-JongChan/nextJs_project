const query = {
    count_local: "SELECT COUNT(*) CNT FROM LOCAL",
    count_spec: "SELECT COUNT(*) CNT FROM SPEC",
    count_poketmon: "SELECT COUNT(*) CNT FROM POKETMON",
    status_local: "SELECT COUNT(*) CNT, MAX(ID) LASTID FROM LOCAL",
    status_spec: "SELECT COUNT(*) CNT, MAX(ID) LASTID FROM SPEC",
    status_poketmon: "SELECT COUNT(*) CNT, MAX(ID) LASTID FROM POKETMON",
    allname_local: "SELECT NAME FROM LOCAL",
    allname_spec: "SELECT NAME FROM SPEC",
    allname_poketmon: "SELECT NAME FROM POKETMON",
    alldata_local: "SELECT * FROM LOCAL",
    alldata_spec: "SELECT * FROM SPEC",
    alldata_poketmon: "SELECT * FROM POKETMON",
    alldata_poketmon_local: "SELECT * FROM POKETMON_LOCAL",
    alldata_poketmon_spec: "SELECT * FROM POKETMON_SPEC",
    alldata_poketmon_image: "SELECT * FROM POKETMON_IMAGE",
    id_local: "SELECT ID FROM LOCAL WHERE NAME=@name",
    id_spec: "SELECT ID FROM SPEC WHERE NAME=@name",
    id_poketmon: "SELECT ID FROM POKETMON WHERE NAME=@name",
};

module.exports = query;
