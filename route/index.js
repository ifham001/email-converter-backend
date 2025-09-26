import { Router} from "express";
import { handler } from "../controller/index.js";

const routes  = Router()

// routes.post('/',checking)
routes.post('/c',handler)




export default routes