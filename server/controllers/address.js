const { Dataset, Address, User } = require("../models");

const get_one_address = async (req, res) => {
  try {
    const { _id } = req.params;
    const address = await Address.findById({ _id }).select("-__v");

    if (!address) {
      res.status(404);
      throw new Error("The address you are looking for could not be found.");
    }

    res.status(200).json({ error: false, success: true, data: address });
  } catch (error) {
    console.log(error);
    res.json({ error: true, success: false, message: error.message });
  }
};

const remove_one_address = async (req, res) => {
  try {
    const { _id } = req.params;
    const found_address = await Address.findByIdAndDelete({_id}, { new: true });

    console.log("***** found_address *****");
    console.log(found_address);

    if (!found_address) {
      res.status(404);
      throw new Error("The address you are looking for could not be found.");
    }

    const updated_dataset = await Dataset.updateOne(
      { _id: found_address.dataset_id },
      { $pullAll: { addresses: [found_address._id] } },
      { new: true }
    );

    res.status(200).json({ error: false, success: true, data: updated_dataset });
  } catch (error) {
    console.log(error);
    res.json({ error: true, success: false, message: error.message });
  }
};

const edit_address = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(req.body);
    const edited_address = await Address.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json(edited_address);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { get_one_address, remove_one_address, edit_address };
