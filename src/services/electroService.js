import Electro from "../models/Electronics.js";

const create = (elData, userId) => {
  return Electro.create({ ...elData, owner: userId });
};

const getAll = (filter = {}) => {
  const query = Electro.find();

  if (filter.name) {
    query.find({ name: { $regex: filter.name, $options: "i" } });
  }

  if (filter.type) {
    query.find({ type: { $regex: filter.type, $options: "i" } });
  }

  return query;
};

const getOne = (id) => {
  return Electro.findById(id);
};

const buy = (productId, userId) => {
  return Electro.findByIdAndUpdate(productId, {
    $push: { buyingList: userId },
  });
};

const del = (id) => {
  return Electro.findByIdAndDelete(id);
};

const edit = (productId, itemData) => {
  return Electro.findByIdAndUpdate(productId, itemData);
};

export default {
  create,
  getAll,
  getOne,
  buy,
  del,
  edit,
};
