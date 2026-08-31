"use strict";

/** Inserts a compact warehouse, medication, and stock dataset for testing. */
const WAREHOUSES = [
  {
    name: "Central Warehouse",
    address: "Calle 20 # 10-15"
  },
  {
    name: "North Warehouse",
    address: "Carrera 45 # 80-20"
  }
];

const MEDICATIONS = [
  {
    name: "Acetaminophen 500 mg",
    description: "Analgesic and antipyretic medication"
  },
  {
    name: "Amoxicillin 500 mg",
    description: "Antibiotic medication"
  }
];

module.exports = {
  async up(queryInterface) {
    const [existingWarehouses] = await queryInterface.sequelize.query(
      "SELECT name FROM warehouses WHERE name IN ('Central Warehouse', 'North Warehouse')"
    );
    const existingWarehouseNames = new Set(
      existingWarehouses.map((warehouse) => warehouse.name)
    );
    const now = new Date();

    const warehousesToInsert = WAREHOUSES
      .filter((warehouse) => !existingWarehouseNames.has(warehouse.name))
      .map((warehouse) => ({
        ...warehouse,
        is_active: true,
        createdAt: now,
        updatedAt: now
      }));

    if (warehousesToInsert.length > 0) {
      await queryInterface.bulkInsert("warehouses", warehousesToInsert);
    }

    const [existingMedications] = await queryInterface.sequelize.query(
      "SELECT name FROM medications WHERE name IN ('Acetaminophen 500 mg', 'Amoxicillin 500 mg')"
    );
    const existingMedicationNames = new Set(
      existingMedications.map((medication) => medication.name)
    );

    const medicationsToInsert = MEDICATIONS
      .filter((medication) => !existingMedicationNames.has(medication.name))
      .map((medication) => ({
        ...medication,
        is_active: true,
        createdAt: now,
        updatedAt: now
      }));

    if (medicationsToInsert.length > 0) {
      await queryInterface.bulkInsert("medications", medicationsToInsert);
    }

    const [warehouses] = await queryInterface.sequelize.query(
      "SELECT id, name FROM warehouses WHERE name IN ('Central Warehouse', 'North Warehouse')"
    );
    const [medications] = await queryInterface.sequelize.query(
      "SELECT id, name FROM medications WHERE name IN ('Acetaminophen 500 mg', 'Amoxicillin 500 mg')"
    );

    const warehouseIds = Object.fromEntries(
      warehouses.map((warehouse) => [warehouse.name, warehouse.id])
    );
    const medicationIds = Object.fromEntries(
      medications.map((medication) => [medication.name, medication.id])
    );

    const inventoryData = [
      {
        warehouseId: warehouseIds["Central Warehouse"],
        medicationId: medicationIds["Acetaminophen 500 mg"],
        quantity: 200
      },
      {
        warehouseId: warehouseIds["Central Warehouse"],
        medicationId: medicationIds["Amoxicillin 500 mg"],
        quantity: 100
      },
      {
        warehouseId: warehouseIds["North Warehouse"],
        medicationId: medicationIds["Acetaminophen 500 mg"],
        quantity: 150
      }
    ];

    const [existingInventory] = await queryInterface.sequelize.query(
      "SELECT warehouse_id, medication_id FROM inventories"
    );
    const inventoryKeys = new Set(
      existingInventory.map((inventory) => `${inventory.warehouse_id}-${inventory.medication_id}`)
    );

    const inventoriesToInsert = inventoryData
      .filter((inventory) => !inventoryKeys.has(`${inventory.warehouseId}-${inventory.medicationId}`))
      .map((inventory) => ({
        warehouse_id: inventory.warehouseId,
        medication_id: inventory.medicationId,
        quantity: inventory.quantity,
        is_active: true,
        createdAt: now,
        updatedAt: now
      }));

    if (inventoriesToInsert.length > 0) {
      await queryInterface.bulkInsert("inventories", inventoriesToInsert);
    }
  },

  async down(queryInterface) {
    const [warehouses] = await queryInterface.sequelize.query(
      "SELECT id FROM warehouses WHERE name IN ('Central Warehouse', 'North Warehouse')"
    );

    await queryInterface.bulkDelete("inventories", {
      warehouse_id: warehouses.map((warehouse) => warehouse.id)
    });
    await queryInterface.bulkDelete("medications", {
      name: MEDICATIONS.map((medication) => medication.name)
    });
    await queryInterface.bulkDelete("warehouses", {
      name: WAREHOUSES.map((warehouse) => warehouse.name)
    });
  }
};
