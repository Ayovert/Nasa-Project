const launches = new Map();

let latestFlightNumber = 100;
const launch = {
    flightNumber:100,
    mission: ' Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};



launches.set(launch.flightNumber, launch);


function launchExists(launchId){
    return launches.has(launchId);
}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, 
        Object.assign(launch, {
            customers: ['ZTM', 'NASA'],
            upcoming: true,
            success: true,
            flightNumber : latestFlightNumber,
        }));
};


function abortLaunch(launchId){
const aborted = launches.get(launchId);
aborted.upcoming = false;
aborted.success = false;
return aborted;

}


module.exports = {
    launchExists,
    getAllLaunches,
    addNewLaunch,
    abortLaunch

};