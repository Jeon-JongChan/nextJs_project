const query = {
    update_poketmon_dt: `
    UPDATE POKETMON SET UPDATE_DT=datetime('now','localtime')
    WHERE ID IN (SELECT ID FROM POKETMON WHERE NAME=@name LIMIT 1)
    `,
};

module.exports = query;
