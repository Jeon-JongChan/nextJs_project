const query = {
    update: {
        poketmon_dt: `
        UPDATE POKETMON SET UPDATE_DT=datetime('now','localtime')
        WHERE NAME=@name
        `,
        boilerplate_dt: `
        UPDATE BOILERPLATE SET UPDATE_DT=datetime('now','localtime')
        WHERE NAME=@name
        `,
    },
};

module.exports = query;
