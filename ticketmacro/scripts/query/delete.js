const query = {
    drop: {
        local: "DROP TABLE LOCAL",
    },
    truncate: {
        local: "DELETE FROM LOCAL",
    },
    delete: {
        sse: "DELETE FROM SSE WHERE NAME=@name AND ID=@id",
    },
};

module.exports = query;
