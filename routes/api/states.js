const express = require("express");
const router = express();
const stateController = require("../../controllers/stateController");

const data = {};
data.states = require('../../model/states.json');


router.route("/").get(stateController.getAllStates);  
router.route("/:id").get(stateController.getState);
router.route("/:id/funfact").get(stateController.getFunFact);
router.route("/:id/funfact").post(stateController.createFunFact);
router.route("/:id/funfact").patch(stateController.updateFunFact);
router.route("/:id/funfact").delete(stateController.deleteFunFact);
//router.route('/:id/nickname').get(stateController.getAttribute);
//router.route('/:id/capital').get(stateController.getAttribute);
//router.route('/:id/population').get(stateController.getAttribute);

module.exports = router;