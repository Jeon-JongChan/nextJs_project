const query = {
    drop: {
        sse: "DROP TABLE IF EXISTS SSE",
        macro: "DROP TABLE IF EXISTS MACRO",
    },
    truncate: {
        local: "DELETE FROM LOCAL",
    },
    delete: {
        sse: "DELETE FROM SSE WHERE NAME=@name AND ID=@id",
    },
};

module.exports = query;
