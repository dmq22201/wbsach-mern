class APIFeature {
  constructor(queryObjFromMongoose, queryStrFromReq) {
    this.queryObjFromMongoose = queryObjFromMongoose;
    this.queryStrFromReq = queryStrFromReq;
  }

  filter() {
    const queryObj = { ...this.queryStrFromReq };
    const excludedFields = ["page", "sortby", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.queryObjFromMongoose = this.queryObjFromMongoose.find(
      JSON.parse(queryStr)
    );

    return this;
  }

  sort() {
    if (this.queryStrFromReq.sortby) {
      const sortby = this.queryStrFromReq.sortby.split(",").join("");
      this.queryObjFromMongoose = this.queryObjFromMongoose.sort(sortby); // chaining methods
    } else {
      this.queryObjFromMongoose = this.queryObjFromMongoose.sort("-createdAt"); // sắp xếp giảm dần
    }

    return this;
  }

  limitFields() {
    if (this.queryStrFromReq.fields) {
      const fields = this.queryStrFromReq.fields.split(",").join(" ");
      this.queryObjFromMongoose = this.queryObjFromMongoose.select(fields);
    } else {
      this.queryObjFromMongoose = this.queryObjFromMongoose.select("-__v");
    }

    return this;
  }

  pagination() {
    const page = this.queryStrFromReq.page * 1 || 1;
    const limit = this.queryStrFromReq.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.queryObjFromMongoose = this.queryObjFromMongoose
      .skip(skip)
      .limit(limit);

    return this;
  }

  populate(popOptions) {
    this.queryObjFromMongoose = this.queryObjFromMongoose.populate(popOptions);
    return this;
  }
}

module.exports = APIFeature;
