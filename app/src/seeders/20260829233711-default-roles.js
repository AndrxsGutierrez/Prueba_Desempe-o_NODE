"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles", [
      {
        name: "USER",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      "roles",
      {
        name: ["USER", "ADMIN"]
      }
    );
  }
};