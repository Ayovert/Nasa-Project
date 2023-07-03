const http = require('http');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { mongoConnect } = require('./services/mongo');


const PORT = process.env.PORT || 8000;


//For connection refused err - https://www.mongodb.com/community/forums/t/querysrv-econnrefused/99869/2



//remove angle braces from <password>

const server = http.createServer(app);



async function startServer(){
    await mongoConnect();
    await loadPlanetsData();

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ...`);
});
}


startServer();
