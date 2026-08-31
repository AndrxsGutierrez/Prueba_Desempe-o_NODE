"use strict";

/** Inserts a compact clinic dataset for manual request testing. */
const CLINICS = [
  {
    name: "RiwiMediCare Central Clinic",
    nit: "900123456-7",
    address: "Calle 10 # 20-30",
    phone: "+57 300 123 4567",
    responsible_name: "Ana Pérez",
    responsible_email: "ana.perez@riwimedicare.com"
  },
  {
    name: "RiwiMediCare North Clinic",
    nit: "900765432-1",
    address: "Carrera 50 # 80-15",
    phone: "+57 301 765 4321",
    responsible_name: "Carlos Gómez",
    responsible_email: "carlos.gomez@riwimedicare.com"
  }
];

module.exports = {
  async up(queryInterface) {
    const [existingClinics] = await queryInterface.sequelize.query(
      "SELECT nit FROM clinics WHERE nit IN ('900123456-7', '900765432-1')"
    );
    const existingNits = new Set(existingClinics.map((clinic) => clinic.nit));
    const now = new Date();

    const clinicsToInsert = CLINICS
      .filter((clinic) => !existingNits.has(clinic.nit))
      .map((clinic) => ({
        ...clinic,
        is_active: true,
        createdAt: now,
        updatedAt: now
      }));

    if (clinicsToInsert.length > 0) {
      await queryInterface.bulkInsert("clinics", clinicsToInsert);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("clinics", {
      nit: CLINICS.map((clinic) => clinic.nit)
    });
  }
};
