const {mongoose} = require('mongoose');


mongoose.connect('mongodb+srv://mrsrik307:Ezhil%40sri@cluster0.ebyla.mongodb.net/guru?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

  
module.exports = {db:mongoose};