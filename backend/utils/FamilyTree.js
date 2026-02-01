// utils/buildFamilyTree.js
const Cattle = require("../models/cattle");

async function buildFamilyTree(id, generations = 3, visited = new Set()) {
  if (!id || generations === 0) return null;

  if (visited.has(id.toString())) {
    return { error: "Cycle detected" };
  }

  visited.add(id.toString());

  const animal = await Cattle.findOne({unique_id: id})
    .populate("sire_id", "unique_id name breed_name gender")
    .populate("dam_id", "unique_id name breed_name gender")
    .lean();

  if (!animal) return null;

  return {
    ...animal,
    sire: await buildFamilyTree(animal.sire_id?.unique_id, generations - 1, visited),
    dam: await buildFamilyTree(animal.dam_id?.unique_id, generations - 1, visited)
  };
}


module.exports = { buildFamilyTree };
