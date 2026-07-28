import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  res.json({
    host: req.headers.host,
    x_forwarded_host: req.headers["x-forwarded-host"],
    x_forwarded_proto: req.headers["x-forwarded-proto"],
    protocol: req.protocol
  });
});
export default router;
