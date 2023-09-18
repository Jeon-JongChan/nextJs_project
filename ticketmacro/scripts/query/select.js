const query = {
    sse: {
        first: "select * from SSE where name = @name order by id limit 1",
    },
};

module.exports = query;
