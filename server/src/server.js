const http = require('http');
require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');





const PORT = process.env.PORT || 8000;


//For connection refused err - https://www.mongodb.com/community/forums/t/querysrv-econnrefused/99869/2



//remove angle braces from <password>

const server = http.createServer(app);



async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ...`);
});
}


startServer();
