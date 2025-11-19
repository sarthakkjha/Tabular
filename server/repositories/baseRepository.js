const { supabase, supabaseAdmin } = require("../config/supabase");

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.supabase = supabase;
    this.supabaseAdmin = supabaseAdmin;
  }

  // Generic find all method
  async findAll(conditions = {}) {
    try {
      let query = this.supabase.from(this.tableName).select("*");

      // Apply conditions
      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.findAll:`, error);
      throw error;
    }
  }

  // Generic find by ID method
  async findById(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.findById:`, error);
      throw error;
    }
  }

  // Generic create method
  async create(data) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .insert([
          {
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.create:`, error);
      throw error;
    }
  }

  // Generic update method
  async update(id, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.update:`, error);
      throw error;
    }
  }

  // Generic delete method
  async delete(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.delete:`, error);
      throw error;
    }
  }

  // Generic exists method
  async exists(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select("id")
        .eq("id", id)
        .single();

      if (error && error.code === "PGRST116") {
        return false;
      }

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.exists:`, error);
      throw error;
    }
  }

  // Generic count method
  async count(conditions = {}) {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select("*", { count: "exact", head: true });

      // Apply conditions
      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { count, error } = await query;
      if (error) throw error;
      return count;
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.count:`, error);
      throw error;
    }
  }
}

module.exports = BaseRepository;
