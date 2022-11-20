// import server from "../../scripts/server";

export default function handler(req, res) {
    console.log(req.body);
    // server.file.save()
    res.status(200).json({ name: "John Doe" });
}
