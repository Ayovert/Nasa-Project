const { launchExists, getAllLaunches, addNewLaunch, abortLaunch } = require('../../models/launches.model');


//abstract model manipulation
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {

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
    addNewLaunch(launch);


    return res.status(201).json(launch);



}

function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);

    if(!launchExists(launchId)){
        return res.status(400).json({
            error: `Launch with id: ${launchId} not found`
        });
    }


    const aborted = abortLaunch(launchId);

    return res.status(200).json(aborted);


}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}