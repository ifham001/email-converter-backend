import express from 'express'
import cors from 'cors'
import routes from './route/index.js'


const app = express()
app.use(cors())
app.use(express.json())



app.use('/home',(req,res,next)=>{
    res.send('hellow world')
})
app.use('/converter',routes)

app.listen(3008,()=>{
    return console.log("working")
})