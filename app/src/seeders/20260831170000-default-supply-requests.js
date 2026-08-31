"use strict";

/** Inserts pending supply requests using the default testing dataset. */
module.exports = {
  async up(queryInterface) {
    const [clinics] = await queryInterface.sequelize.query(
      "SELECT id, nit FROM clinics WHERE nit IN ('900123456-7', '900765432-1')"
    );
    const [warehouses] = await queryInterface.sequelize.query(
      "SELECT id, name FROM warehouses WHERE name IN ('Central Warehouse', 'North Warehouse')"
    );
    const [medications] = await queryInterface.sequelize.query(
      "SELECT id, name FROM medications WHERE name IN ('Acetaminophen 500 mg', 'Amoxicillin 500 mg')"
    );
    const [users] = await queryInterface.sequelize.query(
      "SELECT id, email FROM users WHERE email = 'admin@example.com'"
    );

    const clinicIds = Object.fromEntries(clinics.map((clinic) => [clinic.nit, clinic.id]));
    const warehouseIds = Object.fromEntries(
      warehouses.map((warehouse) => [warehouse.name, warehouse.id])
    );
    const medicationIds = Object.fromEntries(
      medications.map((medication) => [medication.name, medication.id])
    );
    const adminId = users[0]?.id;

    if (!adminId || !clinicIds["900123456-7"] || !warehouseIds["Central Warehouse"] || !medicationIds["Acetaminophen 500 mg"]) {
      throw new Error("Debes ejecutar primero los seeders de usuarios, clínicas e inventario");
    }

    const requests = [
      {
        clinicId: clinicIds["900123456-7"],
        warehouseId: warehouseIds["Central Warehouse"],
        medicationId: medicationIds["Acetaminophen 500 mg"],
        quantity: 10
      },
      {
        clinicId: clinicIds["900765432-1"],
        warehouseId: warehouseIds["North Warehouse"],
        medicationId: medicationIds["Acetaminophen 500 mg"],
        quantity: 15
      }
    ];

    const [existingRequests] = await queryInterface.sequelize.query(
      "SELECT clinic_id, warehouse_id, medication_id, created_by_user_id FROM supply_requests WHERE status = 'PENDING'"
    );
    const requestKeys = new Set(
      existingRequests.map(
        (request) => `${request.clinic_id}-${request.warehouse_id}-${request.medication_id}-${request.created_by_user_id}`
      )
    );
    const now = new Date();

    const requestsToInsert = requests
      .filter((request) => !requestKeys.has(`${request.clinicId}-${request.warehouseId}-${request.medicationId}-${adminId}`))
      .map((request) => ({
        clinic_id: request.clinicId,
        warehouse_id: request.warehouseId,
        medication_id: request.medicationId,
        created_by_user_id: adminId,
        quantity: request.quantity,
        status: "PENDING",
        is_active: true,
        createdAt: now,
        updatedAt: now
      }));

    if (requestsToInsert.length > 0) {
      await queryInterface.bulkInsert("supply_requests", requestsToInsert);
    }
  },

  async down(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@example.com'"
    );

    if (users[0]?.id) {
      await queryInterface.bulkDelete("supply_requests", {
        created_by_user_id: users[0].id,
        status: "PENDING"
      });
    }
  }
};
