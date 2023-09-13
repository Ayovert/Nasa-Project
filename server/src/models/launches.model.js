const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;






async function getAllLaunches(skip, limit) {
  //   return Array.from(launches.values());

  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    })
    .sort({
      flightNumber : 1
    })
    .skip(skip)
    .limit(limit)
    
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {

  try{
    const planet = await planets.findOne({
      keplerName: launch.target
    });
  
    if (!planet) {
      throw new Error("No matching planet found");
    }
  
    const newFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch, {
      customers: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
      flightNumber: newFlightNumber,
    });
  
    await saveLaunch(newLaunch);
  }catch(err){
    console.error(err)
  }
  
}

const SpaceX_API_URL = "https://api.spacexdata.com/v4/launches/query";


async function populateLaunches(){
  console.log("DOwnload SpaceX launches data...");
  try{
    const response = await axios.post(SpaceX_API_URL, {
      query: {},
      options: {
        pagination:false, // expensive request if we need to load everytime
        //check if launchData exists in DB
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
              path: "payloads",
              select:{
                  customers:1
              }
          }
        ],
      },
    });

    if(response.status !== 200){
      console.log('Problem with loading launch data');
      throw new Error('Loading launch data failed');
    }
  
  
    const launchDocs = response.data.docs;
  
    for(const launchDoc of launchDocs){
  
      const payloads = launchDoc['payloads'];
  
      const customers = payloads.flatMap((payload) => {
       return payload['customers'];
      })
      const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers
      }
  
      console.log(`${launch.flightNumber} ${launch.mission}`);

      //populate launches collection
      //make target not required in schema not required
      await saveLaunch(launch);
  }

 
  }catch(ex){
    console.log(ex);
  }

  //
}
async function loadLaunchData() {

  const firstLaunch =await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  });

  if(firstLaunch){
    console.log('Launch data was already loaded!');
    
  }else{
    await populateLaunches();
  }


 
}

async function launchExists(launchId) {
  // return launches.has(launchId);

  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne({}).sort("-flightNumber");

  //- for descending order

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}


async function findLaunch(filter){
  return await launchesDatabase.findOne(filter)
}


async function abortLaunch(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

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
  scheduleNewLaunch,
  loadLaunchData,
};
