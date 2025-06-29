class Service {
  static Model = null;

  static async create(data) {
    delete data.deletedAt;
    const doc = new this.Model(data);
    await doc.save();
    return doc;
  }

  static async get(id, filters = {}) {
    if (!id) {
      return await this.Model.findAll(filters);
    }
    return await this.Model.findDocById(id);
  }

  static async getDocById(id, allowNull = false) {
    return await this.Model.findDocById(id, allowNull);
  }

  static async getDoc(filter = {}, allowNull = false) {
    return await this.Model.findDoc(filter, allowNull);
  }

  static async getWithAggregate(pipeline = []) {
    return await this.Model.aggregate(pipeline);
  }

  static async update(id, updates) {
    delete updates.deletedAt;
    const doc = await this.Model.findDocById(id);
    doc.update(updates);
    await doc.save();
    return doc;
  }

  static async deleteDoc(id) {
    const doc = await this.Model.findDocById(id);
    await doc.deleteOne();
    return doc;
  }
}

export default Service;
