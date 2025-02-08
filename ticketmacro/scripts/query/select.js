const query = {
    sse: {
        first: "select * from SSE where NAME = @name order by id limit 1",
        all: "select * from SSE",
    },
    api_data: {
        macro_list_all: "select SITE, URL, START_DT from MACRO ORDER BY START_DT",
    },
    macro: {
        start: "select * from MACRO where SITE = @site and START_DT <= DATETIME('now','localtime') order by START_DT",
    },
};

module.exports = query;
