function loadTables(orm) {
  orm.defineTable({
    name: 'posts',

    props: {
      autoId: true,
      timestamps: true
    },

    relations: {
      author() {
        return this.belongsTo('users', 'user_id');
      }
    }
  });

  orm.defineTable({
    name: 'users',

    props: {
      autoId: true,
      timestamps: true
    },

    relations: {
      posts() {
        return this.hasMany('posts', 'user_id');
      }
    }
  });
}

module.exports = loadTables;
