import server from "/scripts/server";

export default function handler(req, res) {
    let query = req.query;
    if ((query.query = "select")) {
        let data = server.memdb.get(query.table);
        console.log("select query : ", query, data.value());
        // res.status(200).json(server.memdb.getState());
    }
    res.status(200).json({name: "John Doe"});
}
