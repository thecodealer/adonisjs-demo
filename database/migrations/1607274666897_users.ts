import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('username', 30).unique().notNullable()
      table.string('password').notNullable()
      table.string('first_name', 30)
      table.string('last_name', 30)
      table.string('email', 30)
      table.string('role', 30)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
