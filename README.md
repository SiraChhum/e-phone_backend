# fresh-express
npx sequelize-cli model:generate --name Category --attributes name:string,description:string
npx sequelize-cli db:migrate	--Run all migrations
npx sequelize-cli seed:generate --name demo-users	 ----Create a seeder file
npx sequelize-cli db:seed:all -Seed the database
npx sequelize-cli migration:generate --name add-date-of-birth-to-user    -------------add culumn

npx sequelize-cli init	--Initialize folders
npx sequelize-cli migration:generate	--Create a migration file
npx sequelize-cli db:migrate:undo	--Roll back the last migration
npx sequelize-cli db:seed:undo	--Undo the last seeder
