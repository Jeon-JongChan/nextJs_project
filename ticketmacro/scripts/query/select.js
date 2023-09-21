const query = {
    sse: {
        first: "select * from SSE where NAME = @name order by id limit 1",
        all: "select * from SSE",
    },
};

module.exports = query;
