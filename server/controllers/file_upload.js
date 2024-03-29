const { Dataset, Address, User } = require("../models");
const read_csv = require("../utils/read_csv");

const upload_csv = async (req, res) => {
  console.log("HITTING UPLOAD CSV ROUTE!");
  const { id } = req.params;

  console.log(req.file.path);

  try {
    const {data, kb} = await read_csv(req.file.path);

    const new_dataset = await Dataset.create({ userId: id, kb: kb });
    const updated_user = await User.findOneAndUpdate(
      { _id: id },
      { $push: { datasets: new_dataset._id } },
      { new: true }
    );

    console.log(new_dataset);


    for await (const address of data) {
      console.log(address);
      const added = await Address.create({
        dataset_id: new_dataset._id, 
        street_number: address.street_number,
        route: address.route,
        city: address.city,
        state: address.state,
      });

      const add = await Dataset.findOneAndUpdate(
        { _id: new_dataset._id },
        { $push: { addresses: added._id } },
        { new: true }
      );
    }

    const dataset = await Dataset.findById(new_dataset._id)
      .populate("addresses")
      .select("-__v");

    console.log(dataset);

    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = { upload_csv };
