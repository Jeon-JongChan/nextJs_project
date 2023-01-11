import crawer from "../../../scripts/server/crawler"

export default async function handler(req, res) {
    console.log(req.query.method, req.body);
    let method = req.query.method;
    if(method === 'dbinit') {
        await crawer.dbinit();
    }
    if(method === 'tableTest') {
        let ret = await crawer.tableTest();
        console.log(ret);
    }
    res.status(200).json({ name: 'John Doe' })
}
  