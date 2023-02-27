import server from "/scripts/server";
// import crawer from "/scripts/server/crawler";

export default async function handler(req, res) {
    // console.log("start", req.query, req.body);
    let macroData = req.body;

    res.status(200).json({msg: "매크로테스트"});
}
