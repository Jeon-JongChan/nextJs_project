import server from "/scripts/server";
// import crawer from "/scripts/server/crawler";

export default async function handler(req, res) {
    console.log("macro", req.query.method, req.body);
    // let method = req.query.method;
    // if (method === "dbinit") {
    //     await crawer.dbinit();
    // }
    // if (method === "tableTest") {
    //     let ret = await crawer.tableTest();
    //     console.log(ret);
    // }
    res.status(200).json({method: req.query.method});
}
