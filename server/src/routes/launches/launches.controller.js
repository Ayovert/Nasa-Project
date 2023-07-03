const { launchExists, getAllLaunches, abortLaunch, scheduleNewLaunch } = require('../../models/launches.model');


//abstract model manipulation
async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {

    const launch = req.body;

    if(!launch.mission || !launch.rocket || 
        !launch.launchDate || !launch.target){
            return res.status(400).json({
                error: "Missing required launch property"
            });
        }
    launch.launchDate = new Date(launch.launchDate);


    //isNan(launch.lanchDate) works for date validation too
    if(launch.launchDate.toString() === 'Invalid Date'){
        return res.status(400).json({
            error: "Invalid Launch Date"
        });
    }

   await scheduleNewLaunch(launch);
    return res.status(201).json(launch);



}

async function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);

    const launchExistsById = await launchExists(launchId);

   

    if(!launchExistsById){
        return res.status(404).json({
            error: `Launch with id: ${launchId} not found`
        });
    }


    const aborted = await abortLaunch(launchId);
    
   
    if(!aborted){
        return res.status(400).json({
            error: "Launch not Aborted"
        })
    }

    return res.status(200).json({
        Ok: true
    });


}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}