const data = {
  states: require("../model/states.json"),
  setStates(data) {
    this.states = data;
  },
};

const abb = [ "AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI",
 "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MP", "MS", "MT", "NC",
 "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", 
"OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UM", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY" ];
  

const mStates = require("../model/states");
  

const getAllStates = async(req, res) => {
    
  let stateList;
  const contig = req.query?.contig;

  if (contig === 'true') {
      stateList = data.states.filter(st => st.code !== 'AK' && st.code !== 'HI');
  }
  else if (contig === 'false'){
      stateList = data.states.filter(st => st.code === 'AK' || st.code === 'HI');
  }
  else {
      stateList = data.states;
  }

  const allMStates = await mStates.find({});

  stateList.forEach(state => {
      try {
        const stateExists = allMStates.find(st => st.stateCode === state.code);      
        if (stateExists) {
          state.funfacts = [...stateExists.funfacts];
        }
      } catch (err) {
        console.log(err);
      }
  })

  res.json(stateList);

};


const getState = async (req, res) => {
  
  let p = req.params.id;

  const jState = data.states.filter(st => st.code === p.toUpperCase()); 
  const oneMState = await mStates.findOne({stateCode: req.code}).exec(); 

  let singleStateData = jState[0];
  try{
    singleStateData.funfacts = oneMState.funfacts;
  } catch (err) { 
  }

  res.json(singleStateData);

};


const getFunFact = async (req, res) => {
  
  let p = req.params.id;

  const jState = data.states.filter(st => st.code === p.toUpperCase()); 
  const oneMState = await mStates.findOne({stateCode: req.code}).exec(); 

  let singleStateData = jState[0];
  try{
    singleStateData.funfacts = oneMState.funfacts;
  } catch (err) { 
  }

  let facts = singleStateData.funfacts;
  
  res.json(facts[Math.floor(Math.random() * facts.length)]);
};


const createFunFact = async (req, res) => {
  
  if (!req?.body?.funfacts){ 
    return res.status(400).json({"message": "State fun facts value required"});
  }  

  let facts = req.body.funfacts;
  let p = req.params.id.toUpperCase();

  const jState = data.states.filter(st => st.code === p); 
  const oneMState = await mStates.findOne({stateCode: req.code}).exec(); 

  let singleStateData = jState[0];
  try{
    singleStateData.funfacts = oneMState.funfacts;
  } catch (err) { 
  }

  let o = singleStateData.funfacts;
  facts.forEach(fact => {
    if (!Array.from(o).includes(fact)) {
      let allFacts = Array.from(o).push(fact);
      mStates.updateOne({"stateCode": p},{"funfacts": allFacts});
      o = allFacts;
    }
  });

  res.json("done");
};


const updateFunFact = async (req, res) => {

  if (!req?.body?.funfacts){ 
    return res.status(400).json({"message": "State fun facts value required"});
  }  

  if (!req?.body?.index){ 
    return res.status(400).json({"message": "State index value required"});
  }  

  let facts = req.body.funfacts;
  let index = req.body.index;

  let p = req.params.id.toUpperCase();

  const jState = data.states.filter(st => st.code === p); 
  const oneMState = await mStates.findOne({stateCode: req.code}).exec(); 

  let singleStateData = jState[0];
  try{
    singleStateData.funfacts = oneMState.funfacts;
  } catch (err) { 
  }

  let o = singleStateData.funfacts;
  console.log(o);
  console.log(index - 1);
  if (Array.from(o).length < index){ 
    return res.status(400).json({"message": "Index does not exist"});
  }  

  //o[index-1] = facts;
  o.splice(index - 1, 1, facts);
  await mStates.updateOne({stateCode: p}, {funfacts: o});

  const result = await mStates.findOne({stateCode: p}).exec();
  res.status(201).json(result);
};


const deleteFunFact = async (req, res) => {

  if (!req?.body?.index){ 
    return res.status(400).json({"message": "State index value required"});
  }  

  let index = req.body.index;

  let p = req.params.id.toUpperCase();

  const jState = data.states.filter(st => st.code === p); 
  const oneMState = await mStates.findOne({stateCode: req.code}).exec(); 

  let singleStateData = jState[0];
  try{
    singleStateData.funfacts = oneMState.funfacts;
  } catch (err) { 
  }

  let o = singleStateData.funfacts;
  console.log(o);
  console.log(index - 1);
  if (Array.from(o).length < index){ 
    return res.status(400).json({"message": "Index does not exist"});
  }  

  o.splice(index - 1, 1);
  await mStates.updateOne({stateCode: p}, {funfacts: o});

  const result = await mStates.findOne({stateCode: p}).exec();
  res.status(201).json(result);
}

/*
const getAttribute = async (req, res) => {
  const pathArray = req.route.path.split('/');
  const jState = data.states.filter(st => st.code === req.params.id.toUpperCase());
  if (pathArray[2] === 'capital'){
      res.json({
          "state" : jState[0].state,
          "capital" : jState[0].capital_city
      });
  } else if (pathArray[2] === 'nickname'){
          res.json({
              "state" : jState[0].state,
              "nickname" : jState[0].nickname
          });
  } else if (pathArray[2] === 'population'){
          res.json({
              "state" : jState[0].state,
              "population" : jState[0].population
          });
  } else if (pathArray[2] === 'admission'){
          res.json({
              "state" : jState[0].state,
              "admitted" : jState[0].admission_date
          });
  }
}
*/

module.exports = {
  getAllStates,
  getState,
  getFunFact,
  createFunFact,
  updateFunFact,
  deleteFunFact,
 // getAttribute,
};