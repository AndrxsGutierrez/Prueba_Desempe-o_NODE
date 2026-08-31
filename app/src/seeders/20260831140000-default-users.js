"use strict";

/** Inserts local accounts that simplify manual API testing. */
const DEFAULT_EMAILS = [
  "admin@example.com",
  "usuario1@example.com",
  "usuario2@example.com"
];

module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles WHERE name IN ('ADMIN', 'USER')"
    );

    const rolesByName = Object.fromEntries(
      roles.map((role) => [role.name, role.id])
    );

    if (!rolesByName.ADMIN || !rolesByName.USER) {
      throw new Error("Debes ejecutar primero el seeder de roles");
    }

    const [existingUsers] = await queryInterface.sequelize.query(
      "SELECT email FROM users WHERE email IN ('admin@example.com', 'usuario1@example.com', 'usuario2@example.com')"
    );
    const existingEmails = new Set(existingUsers.map((user) => user.email));
    const now = new Date();

    const users = [
      {
        first_name: "Administrador",
        last_name: "Principal",
        email: "admin@example.com",
        password: "$2b$10$zSPlgGYV5WEFAgx.V2O8xODhbNYNHDT9tiyrqMk/hr7mzj4hNpZfG",
        role_id: rolesByName.ADMIN,
        createdAt: now,
        updatedAt: now
      },
      {
        first_name: "Usuario",
        last_name: "Uno",
        email: "usuario1@example.com",
        password: "$2b$10$WHuAReAMOcG0PF./gwOz3ekYXBtnFh9VnKEJKZC3p9F63MONL46Um",
        role_id: rolesByName.USER,
        createdAt: now,
        updatedAt: now
      },
      {
        first_name: "Usuario",
        last_name: "Dos",
        email: "usuario2@example.com",
        password: "$2b$10$BFJEigNduNdaIc/0PYbHn.tjM2gr1kcmtp8Famh7Euf1QwIH6WaL2",
        role_id: rolesByName.USER,
        createdAt: now,
        updatedAt: now
      }
    ].filter((user) => !existingEmails.has(user.email));

    if (users.length > 0) {
      await queryInterface.bulkInsert("users", users);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: DEFAULT_EMAILS
    });
  }
};
