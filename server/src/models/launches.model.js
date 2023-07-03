const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const launches = new Map();

//let latestFlightNumber = 100;
const launch = {
    flightNumber:100,
    mission: ' Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
   target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNumber, launch);


async function launchExists(launchId){
   // return launches.has(launchId);

   return await launchesDatabase.findOne({
    flightNumber: launchId
   })
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
    .findOne({})
    .sort('-flightNumber');

    //- for descending order


    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(){
 //   return Array.from(launches.values());
 return await launchesDatabase
 .find({}, {
    '_id':0, '__v':0
 });
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if(!planet){
        throw new Error('No matching planet found');

      
    }

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,

    }, launch,{
        upsert: true
    })
}

async function scheduleNewLaunch(launch){

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch,{
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true,
        flightNumber: newFlightNumber
    });

    await saveLaunch(newLaunch);
}

/*function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, 
        Object.assign(launch, {
            customers: ['ZTM', 'NASA'],
            upcoming: true,
            success: true,
            flightNumber : latestFlightNumber,
        }));
};*/


async function abortLaunch(launchId){

 const aborted =   await launchesDatabase.updateOne({
        flightNumber:launchId
    }, {
        upcoming: false,
        success: false
    
    })

    console.log(aborted);
//const aborted = launches.get(launchId);
//aborted.upcoming = false;
//aborted.success = false;
return aborted.acknowledged === true && aborted.modifiedCount === 1;

}


module.exports = {
    launchExists,
    getAllLaunches,
    abortLaunch,
    scheduleNewLaunch
};