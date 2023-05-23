const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.SRC_URL,
}))


app.use(express.urlencoded({extended: true}));


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}.`);
})

