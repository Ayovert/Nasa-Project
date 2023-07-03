const mongoose = require('mongoose');



const MONGO_URL = "mongodb+srv://ayobamijimoh11:VBVbWf73abAWf3h@nasacluster0.l3x0jsd.mongodb.net/?retryWrites=true&w=majority";


mongoose.connection.once('open', () => {
    console.log('MongoDB Connection ready')
});

mongoose.connection.on('error', (err) => {
    console.error(err);
})


async function mongoConnect(){
  await mongoose.connect(MONGO_URL);
};

async function mongoDisconnect(){
    await mongoose.disconnect();
  };


module.exports = {
    mongoConnect,
    mongoDisconnect
}