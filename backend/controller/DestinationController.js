import Places from "../schemas/Place.js";
import City from "../schemas/Cities.js";
import State from "../schemas/States.js";
async function getAllDestinationsCards(req, res) {
  try {
    const destinationDoc = await State.find().select(
      "stateName stateImage regionType citiesCount overview"
    );

    if (!destinationDoc || destinationDoc.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No destinations found",
      });
    }

    return res.status(200).json({ success: true, data: destinationDoc });
  } catch (error) {
    console.error("Error in getAllDestinationsCards:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch destinations",
    });
  }
}

const getDestinationsCities = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Destination ID is required",
      });
    }

    const destinationCityDoc = await City.find({ regionId: id })
      .select("cityName cityImages");

    if (!destinationCityDoc || destinationCityDoc.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cities found for this destination",
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: destinationCityDoc 
    });
  } catch (error) {
    console.error("Error in getDestinationsCities:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching cities",
    });
  }
};

export { getAllDestinationsCards, getDestinationsCities };