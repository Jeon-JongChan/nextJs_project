// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const authkeys = [process.env.NEXT_ADMIN || "qwer", process.env.NEXT_USER1 || "qwer1", process.env.NEXT_USER2 || "qwer2", process.env.NEXT_USER3 || "qwer3"];
export default function handler(req, res) {
  if (!authkeys.includes(req.body.key)) {
    res.status(401).json({error: "Invalid key"});
    return;
  }
  res.setHeader("Set-Cookie", "authkey=" + req.body.key + "; max-age=86400; Path=/; HttpOnly; Secure; SameSite=Strict");
  res.status(200).json({name: "John Doe"});
}
