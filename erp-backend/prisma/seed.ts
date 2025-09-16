// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Hashing function for the admin password
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log(`Start seeding ...`);

  // 1. Create Permissions
  // =======================
  console.log('Creating permissions...');
  const permissions = [
    // User Management
    { name: 'view_users', description: 'Can view users', module: 'Users' },
    { name: 'manage_users', description: 'Can create, edit, deactivate users', module: 'Users' },
    // Role Management
    { name: 'view_roles', description: 'Can view roles and permissions', module: 'Roles' },
    { name: 'manage_roles', description: 'Can create, edit, assign permissions to roles', module: 'Roles' },
    // Branch Management
    { name: 'view_branches', description: 'Can view branches', module: 'Branches' },
    { name: 'manage_branches', description: 'Can create and edit branches', module: 'Branches' },
    // --- Add more permissions for future sprints here ---
    { name: 'view_customers', description: 'Can view customers', module: 'Customers' },
    { name: 'manage_customers', description: 'Can create and edit customers', module: 'Customers' },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }
  console.log('Permissions created.');

  // 2. Create Roles and Assign Permissions
  // ======================================
  console.log('Creating roles and assigning permissions...');
  
  const allPermissions = await prisma.permission.findMany();
  
  // Super Admin Role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Has all permissions in the system.',
      isSystemRole: true,
    },
  });

  // Link all permissions to Super Admin role
  await prisma.rolePermission.deleteMany({ where: { roleId: superAdminRole.id } });
  for (const p of allPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: superAdminRole.id,
        permissionId: p.id,
      },
    });
  }
  console.log('Super Admin role configured.');
  
  // Operations Staff Role (Example)
  const operationsRole = await prisma.role.upsert({
    where: { name: 'Operations Staff' },
    update: {},
    create: {
      name: 'Operations Staff',
      description: 'Handles day-to-day vehicle and customer operations.',
    },
  });
  // Link specific permissions to Operations Staff
  const opsPermissions = await prisma.permission.findMany({
      where: { name: { in: ['view_customers', 'manage_customers'] } }
  });
  await prisma.rolePermission.deleteMany({where: {roleId: operationsRole.id}});
  for (const p of opsPermissions) {
      await prisma.rolePermission.create({
          data: { roleId: operationsRole.id, permissionId: p.id }
      });
  }
  console.log('Operations Staff role configured.');


  // 3. Create Super Admin User
  // ==========================
  console.log('Creating Super Admin user...');
  const hashedPassword = await hashPassword('SuperSecret123!'); // Use a secure, temporary password

  const superAdminUser = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      fullName: 'Super Administrator',
      username: 'superadmin',
      passwordHash: hashedPassword,
      roleId: superAdminRole.id,
      // This user is not tied to a specific branch
    },
  });
  console.log('Super Admin user created.');

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });